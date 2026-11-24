export const REVIEW_COURSE_ID = "99dc9de5-bfbf-4891-8f5e-444212ec2073";
export const REVIEW_PATH = "/review/project-launch-course";

const reviewAssets = new Set([
  "/review-materials/overview.mp4",
  "/review-materials/overview.vtt",
  "/review-materials/direction.mp4",
  "/review-materials/direction.vtt",
  "/review-materials/firstmove.mp4",
  "/review-materials/firstmove.vtt",
  "/review-materials/project-launch-worksheets.txt",
]);

export function facultyReviewEnabled() {
  return process.env.PLL_FACULTY_REVIEW_ENABLED === "1";
}

export function isReviewAsset(path: string) {
  return reviewAssets.has(path);
}
