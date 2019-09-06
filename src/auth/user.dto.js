class UserDto {
  constructor ({ _id, email, fullName, profileImageId }) {
    this.userId = _id;
    this.email = email;
    this.fullName = fullName;
    this.profileImageId = profileImageId;
  }
}

module.exports = UserDto;
