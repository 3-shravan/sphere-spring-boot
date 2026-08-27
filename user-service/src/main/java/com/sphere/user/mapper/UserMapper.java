package com.sphere.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.sphere.user.entity.User;
import com.sphere.user.dto.response.UserResponse;
import com.sphere.user.dto.response.UserSummaryResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "name", source = "username")
    @Mapping(target = "profilePicture", source = "profilePictureUrl")
    @Mapping(target = "followersCount", ignore = true)
    @Mapping(target = "followingCount", ignore = true)
    @Mapping(target = "isFollowing", ignore = true)
    UserResponse toUserResponse(User user);

    @Mapping(target = "name", source = "username")
    @Mapping(target = "profilePicture", source = "profilePictureUrl")
    UserSummaryResponse toSummary(User user);
}
