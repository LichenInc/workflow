// {{comment}}

@font-face
  font-family: {{fontName}}
  src: url("{{fontPath}}/{{fontName}}.eot")
  src: url("{{fontPath}}/{{fontName}}.eot?#iefix") format('embedded-opentype'), url("{{fontPath}}/{{fontName}}.woff") format('woff'), url("{{fontPath}}/{{fontName}}.ttf") format('truetype'), url("{{fontPath}}/{{fontName}}.svg#{{fontName}}") format('svg')
  font-weight: normal
  font-style: normal

={{className}}($content: '')
  &:before
    -moz-osx-font-smoothing: grayscale
    -webkit-font-smoothing: antialiased
    content: $content
    font-family: '{{fontName}}'
    font-style: normal
    font-variant: normal
    font-weight: normal
    line-height: 1
    speak: none
    text-transform: none
    @content

.{{className}}
  +{{className}}

{% for icon in icons -%}
// Save variable
${{className}}-{{icon.name}}: "\{{icon.code}}"

// Save mixin
={{className}}--{{icon.name}}
  +{{className}}(${{className}}-{{icon.name}})
    @content

// Expose as class
.{{className}}.-{{icon.name}}:before
    content: ${{className}}-{{icon.name}}

{% endfor %}
