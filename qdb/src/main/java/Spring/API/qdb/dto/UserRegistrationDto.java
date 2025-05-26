package Spring.API.qdb.dto;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String lastName;
    private String firstName;
    private String username;
    private String password;
    private String confirmPassword;
}