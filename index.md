---
layout: home
title: I'm Yours
---

<section>
  <div class="jumbotron">
    {% assign promise = site.data.promise %}
    <!-- {{ promise | inspect}}-->
    <small class="text-muted">{{ promise['date'] }}</small>
    <h2>{{ promise['subject'] }}</h2>
    <p class="lead">{{ promise['content'] | markdownify }}</p>
  </div>
</section>

