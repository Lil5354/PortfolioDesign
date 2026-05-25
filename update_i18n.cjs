const fs = require('fs');

const missingKeys = ["student", "most_likes", "freshmanDesigner", "internDesigner", "professionalDesigner", "seniorDesigner", "graduateDesigner", "enterNameOrEmail", "selectOption", "orderedArtwork", "placeholderFullName", "placeholderCompany", "orderDescriptionPlaceholder", "commentError", "gradeError", "canvas", "2d", "copyLinkPrompt", "chooseFormatToDownload", "images", "members", "portfolioNotSetup", "enterScoreAndComment", "enterScoreRange", "critiqueAndFeedback", "leaveCommentPlaceholder", "pleaseLoginToComment1", "pleaseLoginToComment2", "input", "loginWithEmailToUse", "studentLabel", "passwordLabel", "publishedArtworks", "totalPublishedArtworks", "reportedArtworks", "needsProcessing", "totalAccounts", "interactions", "likesAndComments", "approvedArtwork", "justPosted", "artworksToReview", "artworksToReviewDesc", "artworkDistributionBySubject", "recentActivity", "quickActions", "archiveError", "yesterday", "overview", "accounts", "orders", "artworkWarnings", "collectionManagement", "adminPanel", "adminSystem", "backToPortal", "updated", "confirmDeleteArtwork", "updateArtworkDetails", "changeCoverImage", "assignmentType", "addTag", "searchUser", "selectedFile", "deselect", "loadingList", "fullNameHeader", "lockAccountConfirm", "lockAccountWarning", "processArtworksDesc", "highlighted", "searchArtworkStudentTags", "subjectAll", "yearAll", "toolAll", "selectArtworkToViewDetails", "clickToZoom", "reportViolation", "noReportsForArtwork", "deletePermanently", "hideArtworkWarning", "deleteArtworkWarning", "exportPdfConfigDesc", "theme", "noArtworksInCollectionGuide", "curatorNotePriority", "collectionNamePlaceholder", "collectionDescPlaceholder", "delete", "exitDeleteMode", "noArtworksInCollectionMsg", "creativityQuote", "joinUefCreative", "lastName", "lastNamePlaceholder", "firstName", "firstNamePlaceholder", "passwordPlaceholder", "alreadyHaveAccount", "heroTitle1", "heroTitle2", "heroTitle3", "heroTitle4", "fourCourses", "exhibitGallery", "exhibitGalleryDesc", "personalPortfolioDesc", "personalPortfolioLabel", "scoresAndFeedbackDesc", "multiDeviceDesc", "highlightAndInteract", "highlightAndInteractDesc", "recruitmentConnection", "recruitmentConnectionDesc", "featured", "startInThreeSteps", "footerTitle", "onDisplay", "specialized", "enrolled", "features", "studentDesc", "trainingProgram", "journeyToDesigner", "trainingDesc", "majorCommDesign", "majorDigitalUIUX", "majorIllustration3D", "lecturerTeam", "mentorsTitle", "facilities", "creativeSpace", "employerDesc", "process", "findRightCandidate", "browseGalleryDesc", "evaluateProfile", "evaluateProfileDesc", "connectCandidate", "connectCandidateDesc", "schoolDesc", "valueForSchool", "digitalMaterials", "digitalMaterialsDesc", "onlineExhibition", "onlineExhibitionDesc", "trainingStats", "trainingStatsDesc", "interestedInSystem", "contactForConsultation", "schoolAddress", "message", "writeYourMessage", "selectCollection", "create", "curatorNotePlaceholder", "errorGeneric", "confirmDeleteTimeline", "portfolioSettingsDesc", "basicInfo", "featuredArtworks", "maxFourFeatured", "changeArtwork", "selectFeaturedArtwork", "selectFeaturedArtworks", "selectMaxFour", "noPublicArtworks", "add", "manageTimeline", "editTimelineEntry", "addTimelineEntry", "selectMonth", "selectYear", "timelineTitlePlaceholder", "timelineDescPlaceholder", "tagsCommaSeparated", "tagsPlaceholder", "linkPaperCert", "linkLabelPlaceholder", "bgImageUrl", "savingDots", "previewTimeline", "viewOnPortfolio", "achievementMilestones", "portfolioVisibilityDesc", "updateError", "connectionError", "loadingInfo", "fullNameLabel"];

const convertToText = (key) => {
  let text = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Manually specify important ones
const specificKeys = {
  heroTitle1: "Khám phá",
  heroTitle2: "Những đồ án",
  heroTitle3: "xuất sắc nhất",
  heroTitle4: "từ sinh viên UEF",
  exhibitGallery: "Triển lãm trực tuyến",
  exhibitGalleryDesc: "Trưng bày đồ án với chất lượng tốt nhất",
  student: "Sinh viên",
  fourCourses: "4 Khóa",
  features: "Tính năng",
  lecturerTeam: "Đội ngũ giảng viên",
  mentorsTitle: "Những người hướng dẫn",
  facilities: "Cơ sở vật chất",
  creativeSpace: "Không gian sáng tạo",
  contactForConsultation: "Liên hệ tư vấn",
  schoolAddress: "Địa chỉ trường",
  message: "Tin nhắn",
  writeYourMessage: "Viết tin nhắn của bạn",
  recentActivity: "Hoạt động gần đây",
  quickActions: "Thao tác nhanh",
  adminPanel: "Quản trị viên",
  overview: "Tổng quan",
  lastName: "Họ",
  firstName: "Tên",
  fourCourses: "4 Khóa",
};

let viEntries = [];
let enEntries = [];

missingKeys.forEach(k => {
  if (k === ',' || k === '/' || k === '') return;
  const viText = specificKeys[k] || convertToText(k);
  const enText = convertToText(k); // Google Translate will handle it anyway, just need dummy for en
  viEntries.push(`    ${k}: ${JSON.stringify(viText)},`);
  enEntries.push(`    ${k}: ${JSON.stringify(enText)},`);
});

let i18n = fs.readFileSync('lib/i18n.jsx', 'utf8');

// Insert into vi
i18n = i18n.replace('  vi: {\n', '  vi: {\n' + viEntries.join('\n') + '\n');
// Insert into en
i18n = i18n.replace('  en: {\n', '  en: {\n' + enEntries.join('\n') + '\n');

fs.writeFileSync('lib/i18n.jsx', i18n);
console.log("Updated i18n.jsx successfully");
