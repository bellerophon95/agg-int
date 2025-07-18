# Instructions

This app is deployed on Render on the free tier, so it might take up to a minute to wake up from hibernation/dormant state.

## Demo

https://www.loom.com/share/c9a2211c734d4027a37458ea314c66b7?sid=8d2d9737-d458-4eb8-b5a9-3543a85a9211



## UI Deploy Link
[https://agg-int-1.onrender.com](https://agg-int-1.onrender.com)

## API Deploy Link
[https://agg-int.onrender.com](https://agg-int.onrender.com)



## Usage Instructions

Click on the Render UI and API links, and wait till they are BOTH deployed. Next, use either of the following sample user to login. The system also supports the creation of new accounts :

- **email:** johndoe@example.com  
  **password:** Password123!

- **email:** alicebrown@example.com  
  **password:** Tr0ub4d3!K1ng

- **email:** bobjohnson@example.com  
  **password:** 17dvqwfqw21323


## Local Deployment Instructions

```
git clone git@github.com:bellerophon95/agg-int.git
```

Deploy API

```
cd quick_notes/app
uvicorn main:app
```

Deploy UI
```
cd quick_notes/ai-ui
npm run start
```



