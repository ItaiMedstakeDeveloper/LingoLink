# Lesson illustrations

Drop the story-lesson PNGs into this folder using the **exact** filenames below,
then activate them in [`constants/lesson-images.ts`](../../../constants/lesson-images.ts)
(uncomment each entry's `require(...)` and remove its `: null`).

Filenames must match exactly — Metro resolves `require()` paths at build time.

| Lesson | Title                      | Filename                                  |
| ------ | -------------------------- | ----------------------------------------- |
| 3      | Mbare Market Arrives       | `lesson-03-mbare-market.png`              |
| 4      | Ambuya Chipo's Tomatoes    | `lesson-04-ambuya-chipo-tomatoes.png`     |
| 5      | Zhou Wei & the Charger     | `lesson-05-zhou-wei-charger.png`          |
| 6      | Marguerite and the Shoes   | `lesson-06-marguerite-shoes.png`          |
| 8      | The Professor's Question   | `lesson-08-professors-question.png`       |
| 9      | The Ride Home              | `lesson-09-ride-home.png`                 |
| 10     | Five Conversations         | `lesson-10-five-conversations.png`        |

> Lessons 1, 2 and 7 don't have artwork yet — add rows for them in
> `constants/lesson-images.ts` when their images are ready.

## Why can't the assistant just save the pasted images?

Images pasted into chat are visible to the assistant but aren't files on disk,
so they can't be written into the repo automatically. Saving the PNGs here is a
one-time manual step; everything that references them is already wired up.
