#### Respect `<!-- prettier-ignore -->` placed inside an HTML block (#NNNN by @user)

<!-- prettier-ignore -->
```md
<!-- Input -->
<div>this is necessary</div>
<!-- prettier-ignore -->
<pre>

  indent this line please
</pre>

<!-- Prettier stable -->
<div>this is necessary</div>
<!-- prettier-ignore -->
<pre>

indent this line please

</pre>

<!-- Prettier main -->
<div>this is necessary</div>
<!-- prettier-ignore -->
<pre>

  indent this line please
</pre>
```
