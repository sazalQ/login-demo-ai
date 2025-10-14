# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - link "Vite logo" [active] [ref=e4] [cursor=pointer]:
      - /url: https://vite.dev
      - img "Vite logo" [ref=e5] [cursor=pointer]
    - link "React logo" [ref=e6] [cursor=pointer]:
      - /url: https://react.dev
      - img "React logo" [ref=e7] [cursor=pointer]
  - heading "Vite + React" [level=1] [ref=e8]
  - generic [ref=e9]:
    - button "count is 3" [ref=e10] [cursor=pointer]
    - paragraph [ref=e11]:
      - text: Edit
      - code [ref=e12]: src/App.jsx
      - text: and save to test HMR
  - paragraph [ref=e13]: Click on the Vite and React logos to learn more
```