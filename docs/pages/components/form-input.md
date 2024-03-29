---
meta:
  title: Form Input
  description:
layout: component
---

```html:preview
<form id="myform" name="myform" method="POST" action="http://www.baidu.com">
<sl-form-input name="userid" id="userid" value="davie"></sl-form-input>
<button type="button" id="showme">Show Value</button>
<button type="submit" id="submit">Submit</button>
</form>
  <script type="module">
  const form = document.myform;
  const btn = document.querySelector('#showme');
  const smt = document.querySelector('#submit');
  // Wait for controls to be defined before attaching form listeners
  await Promise.all([
    customElements.whenDefined('sl-form-input'),
  ]).then(() => {
    btn.addEventListener('click', event => {
      alert('userid is: ' + form.userid.value);
      console.log('form is', form);
    });
    // smt.addEventListener('click', event => {
    //   form.action = "www.aaa.com";
    //   form.submit();
    // });
  });
</script>
```

## Examples

### First Example

TODO

### Second Example

TODO

[component-metadata:sl-form-input]
