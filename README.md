# Frontend Mentor - Advice generator app solution

This is a solution to the [Advice generator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)


## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Generate a new piece of advice by clicking the dice icon

### Screenshot

![Desktop](/Screenshots/Screenshot 2026-01-06 at 17-31-41 advice-generator.png)

### Links

- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- JavaScript (ES6+)
- [React](https://react.dev/) - JS library
- [Vite](https://vitejs.dev/) - React framework
- [Styled Components](https://styled-components.com/) - For styles


### What I learned

I didn't know how build apps with React until this project. I had to go step by step to figure out the fundamentals of React and Vite. 

Some things I learned while building this app:
- How to fetch data from an external API and display it in the UI
- How to manage loading and error states in React
- How rapid user interactions (like clicking a button multiple times) can cause unexpected bugs
- How to prevent duplicate updates by controlling when state changes happen
- The importance of improving user experience with loading feedback

For example, I learned how to make sure only one piece of advice is shown per button click, even if the user clicks quickly:

```
const adviceSnapshot = nextAdvice ?? await fetchAdvice()
setCurrentAdvice(adviceSnapshot)

```

This helped prevent the advice from changing multiple times unexpectedly.


### Continued development

Going forward, I would like to continue improving my skills in:
- Handling async logic more confidently in React
- Writing cleaner and more reusable components
- Improving accessibility and keyboard interactions
- Adding basic tests to catch bugs early
- Understanding performance and UX best practices

### Useful resources

- [React Documentation](https://react.dev/learn) - Helped me understand hooks like useState, useEffect, and useRef
- [MDN Web Docs – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - Useful for learning how data fetching works.


## Author

- Frontend Mentor - [@JordanAMWedderburn](https://www.frontendmentor.io/profile/JordanAMWedderburn)

## Acknowledgments

When dealing with bugs that I had a hard time finding a solution for I did put my code into chatgpt to help figure out what went wrong but I tried to have it explain the error to me so that I can find and fix them myself for next time.
