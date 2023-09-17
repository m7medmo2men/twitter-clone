$(document).ready(() => {
  $.get('/posts', (results) => {
    console.log(results);
    showPosts(results, $('.postsContainer'));
  });
});
