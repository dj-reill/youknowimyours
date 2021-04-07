# About
This repo was originally for documenting the proposal to my fiancee, but now, it will double as a wedding registry and RSVP site. 

I will branch the old one and tag it with ~proposal so if there's ever a need to revert back to the old one (for any purpose) I can do so. 

This took quite a bit of time to get figured out, and I know a lot of you would be wondering: why do this?

The simple answer is that my fiancee and I have written notes to each other over the course of four years. This site was originally supposed to be a private blog to hold our correspondence so we had a back-up for the scraps and post-its for the rest of our lives. The goal was to have a site that would allow me to update it from my phone, e.g. send a text to a repo and have it proceed to load that information onto the site. Using Jekyll, Ruby, and Github's free services, I was ready for action.

But then, I realized that proposing to her would actually take precedence over what I *thought* the site would be about. So, I made it work. Jekyll+Ruby works for website publishing in a pretty incredible way. It made it extraordinarily easy.

## How the site works

Jekyll is a content management system. HTML and CSS are like scaffolding and paint, while Jekyll is like a 3d Printer for houses. It takes a few instructions using files in your _includes, _layouts, and _data folders, and then generates HTML and CSS based off of templates that exist within the _sass directory. It outputs these files to the _site directory while you update. Literally. Every time you save, Jekyll just keeps crapping out new HTML. It's pretty amazing.

If this doesn't make sense, I don't blame you. It's like rocket fuel for websites. 

## How to update

Okay, you lazy bastard. You want to do the same thing that I did. I get it. It was pretty slick. Well, here you go. 

Consult the following site here: https://nicolas-van.github.io/bootstrap-4-github-pages/ 

#. Clone the repo (git clone https://github.com/dj-reill/youknowimyours)
#. download the latest version of Ruby (https://rubyinstaller.org/downloads/)
#. download jekyll with ruby ("gem install jekyll"). 
#. download bundler ("gem install bundler")
#. try bundler update - if that doesn't work, follow the prompts and maybe do a bit of googling. I had to add webrick and minitest to my gemfile. 
#. bundle exec jekyll serve - launches your site. Change the sitemap.xml to change the local site, or just leave it as https://localhost:4000

### Updating the templates

Because the site was designed to read information from a JSON file and load it into an article, you can keep that or remove it. It's totally cool.

go to _layouts and tweak the outline of the html. You'll see how it's a "shell" while ruby will allow you to loop over files in a directory and load content in dynamically. 


### Updating the stylesheet:

**_sass/_variables.scss**
Update the _sass/_variables.scss file to change the colors and create new variables so they be used in the other files.

Note that key classes within the site are enumerated within this file. 



