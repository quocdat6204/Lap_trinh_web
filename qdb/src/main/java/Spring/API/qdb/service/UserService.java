package Spring.API.qdb.service;

import Spring.API.qdb.dto.ChangePasswordDto;
import Spring.API.qdb.dto.LoginDto;
import Spring.API.qdb.dto.UserRegistrationDto;
import Spring.API.qdb.model.User;
import Spring.API.qdb.model.Booking;
import Spring.API.qdb.repository.UserRepository;
import Spring.API.qdb.repository.BookingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    //import org.springframework.beans.factory.annotation.Autowired;
    public UserService(UserRepository userRepository, BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(UserRegistrationDto registrationDto) throws Exception {
        // Kiểm tra tên đăng nhập đã tồn tại chưa
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new Exception("Tên đăng nhập đã tồn tại!");
        }
        
        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
            throw new Exception("Mật khẩu xác nhận không khớp!");
        }
        
        // Tạo user mới
        User user = new User();
        user.setLastName(registrationDto.getLastName());
        user.setFirstName(registrationDto.getFirstName());
        user.setUsername(registrationDto.getUsername());
        
        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        
        // Lưu user vào cơ sở dữ liệu
        return userRepository.save(user);
    }

    public User authenticateUser(LoginDto loginDto) throws Exception {
        User user = userRepository.findByUsername(loginDto.getUsername());
        
        // Kiểm tra nếu user tồn tại
        if (user == null) {
            throw new Exception("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
        
        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new Exception("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
        
        return user;
    }

    public User changePassword(ChangePasswordDto changePasswordDto) throws Exception {
        // Tìm user theo ID
        User user = userRepository.findById(changePasswordDto.getUserId())
                .orElseThrow(() -> new Exception("Không tìm thấy người dùng!"));
        
        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new Exception("Mật khẩu hiện tại không đúng!");
        }
        
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw new Exception("Mật khẩu xác nhận không khớp!");
        }
        
        // Kiểm tra độ dài mật khẩu
        if (changePasswordDto.getNewPassword().length() < 8) {
            throw new Exception("Mật khẩu mới phải có ít nhất 8 ký tự!");
        }
        
        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        
        // Lưu thay đổi vào cơ sở dữ liệu
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Page<User> getPaginatedUsers(Pageable pageable) {
        return userRepository.findAllNonAdminUsers(pageable);
    }

    @Transactional
    public void deleteUser(Long id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Không tìm thấy người dùng!"));
        
        // Tìm tất cả booking của user
        List<Booking> userBookings = bookingRepository.findByUserId(id);
        
        // Đặt userId về null cho tất cả booking của user
        for (Booking booking : userBookings) {
            booking.setUserId(null);
            bookingRepository.save(booking);
        }
        
        // Xóa user
        userRepository.delete(user);
    }

    public User getUserById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("Không tìm thấy người dùng!"));
    }
}
