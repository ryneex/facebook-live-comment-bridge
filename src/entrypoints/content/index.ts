export default defineContentScript({
  matches: ["https://www.facebook.com/live/producer/dashboard/*/COMMENTS/"],
  main() {
    console.log("Hello content!")
  },
})
