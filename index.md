---
layout: home
title: Will You Marry Me?
---

<section>
  <div class="jumbotron">
    {% assign promise = site.data.promise %}
    <!-- {{ promise | inspect}}-->
    <small class="text-muted">{{ promise['date'] }}</small>
    <h2>{{ promise['subject'] }}</h2>
    <p class="lead">{{ promise['content'] | markdownify }}</p>
  </div>
  <!-- 
      {% for g in promise %}
      <h1>{{ g[0] }}</h1>
      {% for item in g %}
      <li>
          {{ item }}
      </li>
      {% endfor %}
    {% endfor%}-->
</section>


