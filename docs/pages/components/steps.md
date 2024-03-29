---
meta:
  title: Steps
  description:
layout: component
---

```html:preview
<sl-steps>
  <sl-step
    label="Main"
    info=""
    icon="backpack"
    active
  ></sl-step>
  <sl-step label="Party" info=""></sl-step>
  <sl-step label="Documents" info=""></sl-step>
</sl-steps>
```

## Examples

### First Example

```html:preview
<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
<sl-steps orientation="vertical" style="height: 100%">
  <sl-step
    label="Disabled"
    info="Info text"
    icon="backpack"
  ></sl-step>
  <sl-step label="Idle" info="Info text"></sl-step>
  <sl-step label="Active" info="Info text" active></sl-step>
</sl-steps>
</div>
```

### Second Example

TODO

[component-metadata:sl-steps]
