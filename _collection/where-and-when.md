---
layout: default
title: Countdown
---
<div>
  {%- if page.title -%}
  <header>
    <h1>{{ page.title }}</h1>
  </header>
  {%- endif -%}

  <section>
    {{ content }}
  </section>

  
  <section id="countdown">
    {% include countdown.html %}
  </section>
</div>