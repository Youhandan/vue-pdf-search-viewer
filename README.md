# vue-pdf-search-preview

## Project setup
```
npm install
```

## Compiles and hot-reloads for development
```
npm run serve
```

## Compiles and minifies for production
```
npm run build
```

## Lints and fixes files
```
npm run lint
```

## Project structure
``` bash
├── examples    # Example to use unpack lib, in order to debug lib before publish
├── packages     # Unpack lib code
├── public      # Static files will be pack to root 
└── ...            # Other config files
```
## Branch

master: Unpack lib and example.  
dev: lib to release,

## Lib Api
| Props | Type | Description |
|-------------|-------------|-------------|
| **src** | string or other(detail to see pdf.js getDocument()) | Pdf url |
| **autoWidth** | boolean, default `false` | Whether to zoom pdf to container width when initial  |  



| Events | Parameters | Description |  
|-------------|-------------|-------------|
| **on-loaded** |  number | Pdf total page number |
| **on-search** |  object: { current, total } | Search keyword matched current number and total count |    
| **on-page-change** |  number | Current page number |



| Methods | Parameters | Description |
|-------------|-------------|-------------|
| **search** |  string | Search keyword in pdf |
| **searchAgain** |  param1:string, param2: boolean  | Param1 is search keyword, param2 is dicided to find pre(true) or find next(false)|  
| **cancelSearch** | none | Cancel search |
| **zoom** | number/ string('auto') | Number: The ratio of pdf zoom, 'auto': zoom to container width |
| **jumpToPage** | number | The page number of pdf jumped to  |
