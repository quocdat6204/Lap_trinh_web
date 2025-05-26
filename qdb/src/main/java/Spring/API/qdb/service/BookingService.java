package Spring.API.qdb.service;

import Spring.API.qdb.dto.BookingDetailsDto;
import Spring.API.qdb.dto.BookingRequestDto;
import Spring.API.qdb.dto.TimeSlotDto;
import Spring.API.qdb.dto.TimeSlot1DTO;
import Spring.API.qdb.dto.DayDto;
import Spring.API.qdb.dto.Day1DTO;
import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Booking;
import Spring.API.qdb.model.Court;
import Spring.API.qdb.model.Racket;
import Spring.API.qdb.model.TimeSlot;
import Spring.API.qdb.model.TimeSlot1;
import Spring.API.qdb.model.Day;
import Spring.API.qdb.model.Day1;
import Spring.API.qdb.model.BookingType;
import Spring.API.qdb.model.BookingStatus;
import Spring.API.qdb.repository.BookingRepository;
import Spring.API.qdb.repository.TimeSlotRepository;
import Spring.API.qdb.repository.TimeSlot1Repository;
import Spring.API.qdb.repository.CourtRepository;
import Spring.API.qdb.repository.RacketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TimeSlotRepository timeSlotRepository;
    
    @Autowired
    private TimeSlot1Repository timeSlot1Repository;
    
    @Autowired
    private CourtRepository courtRepository;
    
    @Autowired
    private RacketRepository racketRepository;

    @Transactional
    public Booking createBooking(BookingRequestDto bookingRequest) {
        double totalPrice = 0.0;

        // Xử lý đặt sân
        if (bookingRequest.getBookingType() != null && 
            bookingRequest.getBookingType().toString().equals("COURT")) {
            List<TimeSlot> timeSlots = new ArrayList<>();
            for (Long id : bookingRequest.getTimeSlotIds()) {
                TimeSlot timeSlot = timeSlotRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("TimeSlot not found with id: " + id));
                if (timeSlot.isBooked()) {
                    throw new RuntimeException("TimeSlot " + id + " is already booked");
                }
                timeSlots.add(timeSlot);
            }
            
            if (!timeSlots.isEmpty()) {
                Court court = timeSlots.get(0).getDay().getCourt();
                totalPrice = Double.parseDouble(court.getPrice()) * timeSlots.size();

                Booking booking = new Booking();
                booking.setUserId(bookingRequest.getUserId());
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(totalPrice);
                booking.setBookingType(BookingType.COURT);
                booking.setStatus(BookingStatus.PENDING);
                booking.setItemName(court.getId().toString());
                booking.setItemDate(timeSlots.get(0).getDay().getDate());
                booking.setItemTime(
                    timeSlots.stream()
                        .map(ts -> ts.getStartTime() + "-" + ts.getEndTime())
                        .collect(java.util.stream.Collectors.joining(", "))
                );
                Booking savedBooking = bookingRepository.save(booking);

                // Cập nhật timeSlots
                for (TimeSlot timeSlot : timeSlots) {
                    timeSlot.setBooked(true);
                    timeSlot.setBookingId(savedBooking.getId());
                    timeSlotRepository.save(timeSlot);
                }

                return savedBooking;
            }
        }
        // Xử lý đặt vợt
        else if (bookingRequest.getBookingType() != null && 
                 bookingRequest.getBookingType().toString().equals("RACKET")) {
            List<TimeSlot1> timeSlots1 = new ArrayList<>();
            for (Long id : bookingRequest.getTimeSlot1Ids()) {
                TimeSlot1 timeSlot = timeSlot1Repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("TimeSlot1 not found with id: " + id));
                if (timeSlot.isBooked()) {
                    throw new RuntimeException("TimeSlot1 " + id + " is already booked");
                }
                timeSlots1.add(timeSlot);
            }

            if (!timeSlots1.isEmpty()) {
                Racket racket = timeSlots1.get(0).getDay().getRacket();
                totalPrice = racket.getPrice() * timeSlots1.size();

                Booking booking = new Booking();
                booking.setUserId(bookingRequest.getUserId());
                booking.setBookingDate(LocalDateTime.now());
                booking.setTotalPrice(totalPrice);
                booking.setBookingType(BookingType.RACKET);
                booking.setStatus(BookingStatus.PENDING);
                booking.setItemName(racket.getId().toString());
                booking.setItemDate(timeSlots1.get(0).getDay().getDate());
                booking.setItemTime(
                    timeSlots1.stream()
                        .map(ts -> ts.getStartTime() + "-" + ts.getEndTime())
                        .collect(java.util.stream.Collectors.joining(", "))
                );
                Booking savedBooking = bookingRepository.save(booking);

                // Cập nhật timeSlots1
                for (TimeSlot1 timeSlot : timeSlots1) {
                    timeSlot.setBooked(true);
                    timeSlot.setBookingId(savedBooking.getId());
                    timeSlot1Repository.save(timeSlot);
                }

                return savedBooking;
            }
        }

        throw new RuntimeException("Invalid booking request");
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Booking> getAllBookings(Pageable pageable) {
        return bookingRepository.findAllWithPagination(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByUserId(Long userId, Pageable pageable) {
        return bookingRepository.findByUserIdWithPagination(userId, pageable);
    }

    @Transactional
    public void confirmBooking(Long bookingId, boolean accept) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (accept) {
            booking.setStatus(BookingStatus.SUCCESS);
        } else {
            booking.setStatus(BookingStatus.FAILED);
            // Trả lại các timeslot
            List<TimeSlot> slots = timeSlotRepository.findByBookingId(bookingId);
            for (TimeSlot t : slots) {
                t.setBooked(false);
                t.setBookingId(null);
                timeSlotRepository.save(t);
            }
            List<TimeSlot1> slots1 = timeSlot1Repository.findByBookingId(bookingId);
            for (TimeSlot1 t : slots1) {
                t.setBooked(false);
                t.setBookingId(null);
                timeSlot1Repository.save(t);
            }
        }
        bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Booking> getPaginatedBookings(Pageable pageable) {
        return bookingRepository.findAllWithPagination(pageable);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Page<Booking> getPaginatedBookingsByUserId(Long userId, Pageable pageable) {
        return bookingRepository.findByUserIdWithPagination(userId, pageable);
    }

    @Transactional(readOnly = true)
    public BookingDetailsDto getBookingDetails(Long id) {
        Booking booking = getBookingById(id);
        BookingDetailsDto dto = new BookingDetailsDto();
        
        // Set common booking information
        dto.setId(booking.getId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setUserId(booking.getUserId());
        dto.setBookingType(booking.getBookingType());
        dto.setStatus(booking.getStatus());
        dto.setItemName(booking.getItemName());
        dto.setItemDate(booking.getItemDate());
        dto.setItemTime(booking.getItemTime());
        
        if (booking.getBookingType() == BookingType.COURT) {
            // Get all time slots for this booking
            List<TimeSlot> timeSlots = timeSlotRepository.findByBookingId(booking.getId());
            if (!timeSlots.isEmpty()) {
                // Get court information from the first time slot
                Court court = timeSlots.get(0).getDay().getCourt();
                dto.setCourtName(court.getName());
                // Convert Day entity to DayDto
                Day dayEntity = timeSlots.get(0).getDay();
                dto.setDay(new DayDto(dayEntity.getId(), dayEntity.getDate(), dayEntity.getCourt().getId()));
                // Convert time slots to DTOs
                List<TimeSlotDto> timeSlotDtos = timeSlots.stream()
                    .map(ts -> new TimeSlotDto(ts.getId(), ts.getStartTime(), ts.getEndTime(), ts.isBooked(), ts.getDay().getId(), ts.getBookingId()))
                    .toList();
                dto.setTimeSlots(timeSlotDtos);
            }
        } else if (booking.getBookingType() == BookingType.RACKET) {
            // Get all time slots for this booking
            List<TimeSlot1> timeSlots1 = timeSlot1Repository.findByBookingId(booking.getId());
            if (!timeSlots1.isEmpty()) {
                // Get racket information from the first time slot
                Racket racket = timeSlots1.get(0).getDay().getRacket();
                dto.setRacketName(racket.getName());
                // Convert Day1 entity to Day1DTO
                Day1 day1Entity = timeSlots1.get(0).getDay();
                dto.setDay1(new Day1DTO(day1Entity.getId(), day1Entity.getDate(), day1Entity.getRacket().getId()));
                // Convert time slots to DTOs
                List<TimeSlot1DTO> timeSlot1Dtos = timeSlots1.stream()
                    .map(ts -> new TimeSlot1DTO(ts.getId(), ts.getStartTime(), ts.getEndTime(), ts.isBooked(), ts.getDay().getId(), ts.getBookingId()))
                    .toList();
                dto.setTimeSlot1s(timeSlot1Dtos);
            }
        }
        
        return dto;
    }
} 