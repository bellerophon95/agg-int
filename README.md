# Instructions

This app is deployed on Render on the free tier, so it might take up to a minute to wake up from hibernation/dormant state.

## Demo

https://www.loom.com/share/c9a2211c734d4027a37458ea314c66b7?sid=8d2d9737-d458-4eb8-b5a9-3543a85a9211



## UI Deploy Link
[https://agg-int-1.onrender.com](https://agg-int-1.onrender.com)

## API Deploy Link
[https://agg-int.onrender.com](https://agg-int.onrender.com)



## Usage Instructions

Use the following sample user to login:

- **Email:** johndoe@example.com  
- **Password:** Password123!



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



