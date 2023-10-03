$(document).ready(() => {
  if (selectedTab === "replies") {
    loadReplies()
  } else {
    loadPosts();
  }
})

function loadPosts() {
  $.get("/api/posts", { postedBy: profileUserId, tweetType: 'tweet' }, results => {
    showPosts(results, $(".postsContainer"))
  })
}
function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, tweetType: 'reply' }, results => {
    showPosts(results, $(".postsContainer"))
  })

}