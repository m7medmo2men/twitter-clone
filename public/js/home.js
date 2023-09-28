$(document).ready(() => {
  $.get('/api/posts', (results) => {
    showPosts(results, $('.postsContainer'));
  });
});
