package Spring.API.qdb.service;

import Spring.API.qdb.model.Booking;
import Spring.API.qdb.model.BookingStatus;
import Spring.API.qdb.model.BookingType;
import Spring.API.qdb.model.Court;
import Spring.API.qdb.model.CourtType;
import Spring.API.qdb.model.Racket;
import Spring.API.qdb.model.RacketType;
import Spring.API.qdb.model.User;
import Spring.API.qdb.repository.BookingRepository;
import Spring.API.qdb.repository.CourtRepository;
import Spring.API.qdb.repository.CourtTypeRepository;
import Spring.API.qdb.repository.RacketRepository;
import Spring.API.qdb.repository.RacketTypeRepository;
import Spring.API.qdb.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final RacketRepository racketRepository;
    private final RacketTypeRepository racketTypeRepository;
    private final UserRepository userRepository;

    public StatisticsService(BookingRepository bookingRepository,
                           CourtRepository courtRepository,
                           CourtTypeRepository courtTypeRepository,
                           RacketRepository racketRepository,
                           RacketTypeRepository racketTypeRepository,
                           UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.courtRepository = courtRepository;
        this.courtTypeRepository = courtTypeRepository;
        this.racketRepository = racketRepository;
        this.racketTypeRepository = racketTypeRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getCourtTypeRanking() {
        List<CourtType> allCourtTypes = courtTypeRepository.findAll();
        List<Court> allCourts = courtRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getBookingType() == BookingType.COURT)
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính số booking cho từng loại sân
        Map<Long, Long> courtTypeToBookingCount = new HashMap<>();
        for (CourtType courtType : allCourtTypes) {
            Set<Long> courtIdsOfType = allCourts.stream()
                .filter(court -> court.getCourtType().getId().equals(courtType.getId()))
                .map(Court::getId)
                .collect(Collectors.toSet());
            long bookingsForType = allBookings.stream()
                .filter(booking -> {
                    if (booking.getItemName() == null) return false;
                    try {
                        Long courtId = Long.valueOf(booking.getItemName());
                        return courtIdsOfType.contains(courtId);
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .count();
            courtTypeToBookingCount.put(courtType.getId(), bookingsForType);
        }

        // Tính tổng số booking của tất cả các loại sân
        long totalBookingsAllCourtTypes = courtTypeToBookingCount.values().stream().mapToLong(Long::longValue).sum();

        return allCourtTypes.stream()
            .map(courtType -> {
                long bookingsForType = courtTypeToBookingCount.getOrDefault(courtType.getId(), 0L);
                double percentage = totalBookingsAllCourtTypes > 0 ? (bookingsForType * 100.0) / totalBookingsAllCourtTypes : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("courtTypeId", courtType.getId());
                stats.put("courtTypeName", courtType.getName());
                stats.put("totalBookings", bookingsForType);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Double.compare(
                (Double) b.get("percentage"),
                (Double) a.get("percentage")
            ))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCourtRanking() {
        List<Court> allCourts = courtRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getBookingType() == BookingType.COURT)
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính số booking cho từng sân
        Map<Long, Long> courtToBookingCount = new HashMap<>();
        for (Court court : allCourts) {
            long bookingsForCourt = allBookings.stream()
                .filter(booking -> {
                    if (booking.getItemName() == null) return false;
                    try {
                        Long courtId = Long.valueOf(booking.getItemName());
                        return court.getId().equals(courtId);
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .count();
            courtToBookingCount.put(court.getId(), bookingsForCourt);
        }

        // Tính tổng số booking của tất cả các sân
        long totalBookingsAllCourts = courtToBookingCount.values().stream().mapToLong(Long::longValue).sum();

        return allCourts.stream()
            .map(court -> {
                long bookingsForCourt = courtToBookingCount.getOrDefault(court.getId(), 0L);
                double percentage = totalBookingsAllCourts > 0 ? (bookingsForCourt * 100.0) / totalBookingsAllCourts : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("courtId", court.getId());
                stats.put("courtName", court.getName());
                stats.put("courtTypeName", court.getCourtType().getName());
                stats.put("totalBookings", bookingsForCourt);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Double.compare(
                (Double) b.get("percentage"),
                (Double) a.get("percentage")
            ))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRacketTypeRanking() {
        List<RacketType> allRacketTypes = racketTypeRepository.findAll();
        List<Racket> allRackets = racketRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getBookingType() == BookingType.RACKET)
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính số booking cho từng loại vợt
        Map<Long, Long> racketTypeToBookingCount = new HashMap<>();
        for (RacketType racketType : allRacketTypes) {
            Set<Long> racketIdsOfType = allRackets.stream()
                .filter(racket -> racket.getRacketType().getId().equals(racketType.getId()))
                .map(Racket::getId)
                .collect(Collectors.toSet());
            long bookingsForType = allBookings.stream()
                .filter(booking -> {
                    if (booking.getItemName() == null) return false;
                    try {
                        Long racketId = Long.valueOf(booking.getItemName());
                        return racketIdsOfType.contains(racketId);
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .count();
            racketTypeToBookingCount.put(racketType.getId(), bookingsForType);
        }

        // Tính tổng số booking của tất cả các loại vợt
        long totalBookingsAllRacketTypes = racketTypeToBookingCount.values().stream().mapToLong(Long::longValue).sum();

        return allRacketTypes.stream()
            .map(racketType -> {
                long bookingsForType = racketTypeToBookingCount.getOrDefault(racketType.getId(), 0L);
                double percentage = totalBookingsAllRacketTypes > 0 ? (bookingsForType * 100.0) / totalBookingsAllRacketTypes : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("racketTypeId", racketType.getId());
                stats.put("racketTypeName", racketType.getName());
                stats.put("totalBookings", bookingsForType);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Double.compare(
                (Double) b.get("percentage"),
                (Double) a.get("percentage")
            ))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRacketRanking() {
        List<Racket> allRackets = racketRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getBookingType() == BookingType.RACKET)
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính số booking cho từng vợt
        Map<Long, Long> racketToBookingCount = new HashMap<>();
        for (Racket racket : allRackets) {
            long bookingsForRacket = allBookings.stream()
                .filter(booking -> {
                    if (booking.getItemName() == null) return false;
                    try {
                        Long racketId = Long.valueOf(booking.getItemName());
                        return racket.getId().equals(racketId);
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .count();
            racketToBookingCount.put(racket.getId(), bookingsForRacket);
        }

        // Tính tổng số booking của tất cả các vợt
        long totalBookingsAllRackets = racketToBookingCount.values().stream().mapToLong(Long::longValue).sum();

        return allRackets.stream()
            .map(racket -> {
                long bookingsForRacket = racketToBookingCount.getOrDefault(racket.getId(), 0L);
                double percentage = totalBookingsAllRackets > 0 ? (bookingsForRacket * 100.0) / totalBookingsAllRackets : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("racketId", racket.getId());
                stats.put("racketName", racket.getName());
                stats.put("racketTypeName", racket.getRacketType().getName());
                stats.put("totalBookings", bookingsForRacket);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Double.compare(
                (Double) b.get("percentage"),
                (Double) a.get("percentage")
            ))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUserBookingRanking() {
        List<User> allUsers = userRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính số booking thành công cho từng user
        Map<Long, Long> userToBookingCount = new HashMap<>();
        for (User user : allUsers) {
            long bookingsForUser = allBookings.stream()
                .filter(booking -> booking.getUserId() != null && booking.getUserId().equals(user.getId()))
                .count();
            userToBookingCount.put(user.getId(), bookingsForUser);
        }
        long totalBookingsAllUsers = userToBookingCount.values().stream().mapToLong(Long::longValue).sum();

        return allUsers.stream()
            .map(user -> {
                long bookingsForUser = userToBookingCount.getOrDefault(user.getId(), 0L);
                double percentage = totalBookingsAllUsers > 0 ? (bookingsForUser * 100.0) / totalBookingsAllUsers : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("userId", user.getId());
                stats.put("username", user.getUsername());
                stats.put("fullName", user.getLastName() + " " + user.getFirstName());
                stats.put("totalBookings", bookingsForUser);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Long.compare((Long) b.get("totalBookings"), (Long) a.get("totalBookings")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUserSpendingRanking() {
        List<User> allUsers = userRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll().stream()
            .filter(booking -> booking.getStatus() == BookingStatus.SUCCESS)
            .collect(Collectors.toList());

        // Tính tổng tiền đã dùng cho từng user
        Map<Long, Double> userToSpending = new HashMap<>();
        for (User user : allUsers) {
            double spendingForUser = allBookings.stream()
                .filter(booking -> booking.getUserId() != null && booking.getUserId().equals(user.getId()))
                .mapToDouble(booking -> booking.getTotalPrice() != null ? booking.getTotalPrice() : 0.0)
                .sum();
            userToSpending.put(user.getId(), spendingForUser);
        }
        double totalSpendingAllUsers = userToSpending.values().stream().mapToDouble(Double::doubleValue).sum();

        return allUsers.stream()
            .map(user -> {
                double spendingForUser = userToSpending.getOrDefault(user.getId(), 0.0);
                double percentage = totalSpendingAllUsers > 0 ? (spendingForUser * 100.0) / totalSpendingAllUsers : 0;
                Map<String, Object> stats = new HashMap<>();
                stats.put("userId", user.getId());
                stats.put("username", user.getUsername());
                stats.put("fullName", user.getLastName() + " " + user.getFirstName());
                stats.put("totalSpending", Math.round(spendingForUser * 100.0) / 100.0);
                stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
                return stats;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("totalSpending"), (Double) a.get("totalSpending")))
            .collect(Collectors.toList());
    }
} 