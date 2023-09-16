$(document).ready(() => {
  $.get('/posts', (results) => {
    console.log(results);
    showPosts(results, $('.postsContainer'));
  });
});

function showPosts(results, document) {
  document.html('');

  results.forEach((result) => {
    let html = createPostHtml(result);
    document.append(html);
  });

  if (results.length == 0) {
    document.append('<span class="noResults">Nothing to show.</span>');
  }
}
