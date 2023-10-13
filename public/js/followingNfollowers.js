$(document).ready(() => {
  if (selectedTab === "following") {
    outputUsers(userJs.following, $(".resultsContainer"));
  } else {
    outputUsers(userJs.followers, $(".resultsContainer"));
  }
})

function outputUsers(results, container) {
  container.html("");
  results.forEach(result => {
    var html = createUserHtml(result, true);
    container.append(html);
  });
}

// user >> profileUser
function createUserHtml(user, showFollowButton) {
  
  let isFollowing = userLoggedIn.following && userLoggedIn.following.some((follower) => follower.id == user.id);
  let text = isFollowing ? "Following" : "Follow";
  let buttonClass = isFollowing ? "followButton following" : "followButton";
  let followButtonHtml = "";
  
  if (showFollowButton && userLoggedIn.id != user.id) {
    followButtonHtml = `
    <div class='followButtonContainer'>
      <button class='${buttonClass}' data-user-id=${user.id}>${text}</button>
    </div>`;
  }

  return `
  <div class='user'>
    <div class="userImageContainer">
      <img src="${user.profilePicture}">
    </div>
    <div class="userDetailsContainer">
      <div class="header">
        <a href="/profile/${user.username}">${user.firstName} ${user.lastName}</a>
        <span>@${user.username}</span>
      </div>
    </div>
    ${followButtonHtml}
  </div>
  `
}
