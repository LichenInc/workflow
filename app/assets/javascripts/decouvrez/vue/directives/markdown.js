import marked from 'marked'

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   gfm: true,
//   tables: true,
//   breaks: false,
//   pedantic: false,
//   sanitize: true,
//   smartLists: true,
//   smartypants: false,
// })

module.exports = {
  update() {
    const content = this.el.innerHTML
    this.el.innerHTML = marked(content)
    console.log(content);
    console.log(marked(content.toString()));
  },
}
