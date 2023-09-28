$(document).ready(() => {
  $.get('/api/posts/' + postId, (results) => {
    outputPostsWithReplies(results, $('.postsContainer'));
  });
});

// function outputPostsWithReplies(post, container) {
//     container.html('');

//     if (post.)
// }
