// =============================================================================
// TREE PROGRESS TEST COMMANDS - Paste vào F12 Console để test
// =========================// Custom set streak values
function setCustomStreak(streak, bestStreak, daysActive) {
  localStorage.setItem('treeProgress_streak', streak.toString());
  localStorage.setItem('treeProgress_bestStreak', (bestStreak || streak).toString());
  localStorage.setItem('treeProgress_daysActive', (daysActive || streak).toString());
  console.log(`🔥 Set streak to ${streak}, best streak to ${bestStreak || streak}, days active to ${daysActive || streak} - Reload page`);
}

// =============================================================================
// 9. TEST STREAK SCENARIOS
// =============================================================================

// Test consecutive day scenario (yesterday)
function testConsecutiveDay() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  localStorage.setItem('treeProgress_lastActiveDate', yesterday.toISOString());
  localStorage.setItem('treeProgress_streak', '5');
  localStorage.setItem('treeProgress_bestStreak', '8');
  localStorage.setItem('treeProgress_daysActive', '15');
  console.log(`📅 Set lastActiveDate to yesterday - Next task completion will increment streak (5→6)`);
}

// Test broken streak scenario (3 days ago)
function testBrokenStreak() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  localStorage.setItem('treeProgress_lastActiveDate', threeDaysAgo.toISOString());
  localStorage.setItem('treeProgress_streak', '10');
  localStorage.setItem('treeProgress_bestStreak', '15');
  localStorage.setItem('treeProgress_daysActive', '25');
  console.log(`💔 Set lastActiveDate to 3 days ago - Next task completion will reset streak (10→1) but increment daysActive (25→26)`);
}

// Test same day scenario (now)
function testSameDay() {
  const now = new Date();
  localStorage.setItem('treeProgress_lastActiveDate', now.toISOString());
  localStorage.setItem('treeProgress_streak', '7');
  localStorage.setItem('treeProgress_bestStreak', '12');
  localStorage.setItem('treeProgress_daysActive', '20');
  console.log(`⏰ Set lastActiveDate to now - Next task completion will NOT change streak/daysActive`);
}

// Test first time user scenario
function testFirstTime() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  localStorage.setItem('treeProgress_lastActiveDate', weekAgo.toISOString());
  localStorage.setItem('treeProgress_streak', '0');
  localStorage.setItem('treeProgress_bestStreak', '0');
  localStorage.setItem('treeProgress_daysActive', '0');
  console.log(`🌱 Set up first time user - Next task completion will set all to 1`);
}

// =============================================================================
// 1. XEM TRẠNG THÁI HIỆN TẠI
// =============================================================================

console.log("🌳 Tree Progress Test Commands loaded!");
console.log("Copy và paste từng command bên dưới vào console để test");

// =============================================================================
// 1. XEM TRẠNG THÁI HIỆN TẠI
// =============================================================================

// Xem tất cả data hiện tại
function viewCurrentState() {
  const data = {
    absoluteHealth: localStorage.getItem('treeProgress_absoluteHealth'),
    waterDrops: localStorage.getItem('treeProgress_waterDrops'),
    streak: localStorage.getItem('treeProgress_streak'),
    bestStreak: localStorage.getItem('treeProgress_bestStreak'),
    daysActive: localStorage.getItem('treeProgress_daysActive'),
    isDead: localStorage.getItem('treeProgress_isDead'),
    revivalTasksCount: localStorage.getItem('treeProgress_revivalTasksCount'),
    missedDeadlines: localStorage.getItem('treeProgress_missedDeadlines'),
    lastActiveDate: localStorage.getItem('treeProgress_lastActiveDate'),
    firstActiveDate: localStorage.getItem('treeProgress_firstActiveDate')
  };
  console.log("🌳 Current Tree State:", data);
  return data;
}

// =============================================================================
// 2. RESET VỀ TRẠNG THÁI BAN ĐẦU
// =============================================================================

// Reset về Seed stage
function resetToSeed() {
  localStorage.setItem('treeProgress_absoluteHealth', '0.00');
  localStorage.setItem('treeProgress_waterDrops', '0');
  localStorage.setItem('treeProgress_streak', '0');
  localStorage.setItem('treeProgress_bestStreak', '0');
  localStorage.setItem('treeProgress_daysActive', '0');
  localStorage.setItem('treeProgress_isDead', 'false');
  localStorage.setItem('treeProgress_revivalTasksCount', '0');
  localStorage.setItem('treeProgress_missedDeadlines', '[]');
  const now = new Date().toISOString();
  localStorage.setItem('treeProgress_lastActiveDate', now);
  localStorage.setItem('treeProgress_firstActiveDate', now);
  console.log("🌱 Reset to Seed stage - Reload page to see changes");
}

// =============================================================================
// 3. TEST CÁC STAGE KHÁC NHAU
// =============================================================================

// Test Seed Stage (0-99 health)
function testSeedStage() {
  localStorage.setItem('treeProgress_absoluteHealth', '50.75');
  localStorage.setItem('treeProgress_waterDrops', '5');
  localStorage.setItem('treeProgress_isDead', 'false');
  console.log("🌱 Set to Seed stage (50.75/99 health, 5 drops) - Reload page");
}

// Test Sprout Stage (100-199 health) 
function testSproutStage() {
  localStorage.setItem('treeProgress_absoluteHealth', '150.25');
  localStorage.setItem('treeProgress_waterDrops', '7');
  localStorage.setItem('treeProgress_isDead', 'false');
  console.log("🌿 Set to Sprout stage (50.25/99 health in Sprout, 7 drops) - Reload page");
}

// Test Sapling Stage (200-299 health)
function testSaplingStage() {
  localStorage.setItem('treeProgress_absoluteHealth', '250.50');
  localStorage.setItem('treeProgress_waterDrops', '8.5');
  localStorage.setItem('treeProgress_isDead', 'false');
  console.log("🌳 Set to Sapling stage (50.50/99 health in Sapling, 8.5 drops) - Reload page");
}

// Test Young Tree Stage (300-399 health)
function testYoungTreeStage() {
  localStorage.setItem('treeProgress_absoluteHealth', '350.90');
  localStorage.setItem('treeProgress_waterDrops', '9');
  localStorage.setItem('treeProgress_isDead', 'false');
  console.log("🌲 Set to Young Tree stage (50.90/99 health in Young Tree, 9 drops) - Reload page");
}

// Test Ancient Tree Stage (400+ health)
function testAncientTreeStage() {
  localStorage.setItem('treeProgress_absoluteHealth', '450.33');
  localStorage.setItem('treeProgress_waterDrops', '6.5');
  localStorage.setItem('treeProgress_isDead', 'false');
  console.log("🌲🌲 Set to Ancient Tree stage (50.33/400 health in Ancient Tree, 6.5 drops) - Reload page");
}

// =============================================================================
// 4. TEST TRẠNG THÁI CHẾT VÀ HỒI SINH
// =============================================================================

// Test cây chết
function testDeadTree() {
  localStorage.setItem('treeProgress_isDead', 'true');
  localStorage.setItem('treeProgress_revivalTasksCount', '3');
  localStorage.setItem('treeProgress_absoluteHealth', '0.00');
  console.log("💀 Set tree to dead state (3/10 revival tasks) - Reload page");
}

// Test gần hồi sinh
function testNearRevival() {
  localStorage.setItem('treeProgress_isDead', 'true');
  localStorage.setItem('treeProgress_revivalTasksCount', '9');
  localStorage.setItem('treeProgress_absoluteHealth', '0.00');
  console.log("💀➡️🌱 Set tree near revival (9/10 tasks) - Reload page");
}

// =============================================================================
// 5. TEST WATER DROPS VÀ STREAK
// =============================================================================

// Test nhiều water drops (gần đủ để tưới)
function testManyDrops() {
  localStorage.setItem('treeProgress_waterDrops', '9.5');
  console.log("💧 Set to 9.5 water drops (gần đủ 10 để auto-tưới) - Reload page");
}

// Test đủ drops để tưới ngay
function testReadyToWater() {
  localStorage.setItem('treeProgress_waterDrops', '10');
  console.log("💧🌊 Set to 10 drops (sẽ auto-tưới sau 1s) - Reload page");
}

// Test high streak
function testHighStreak() {
  localStorage.setItem('treeProgress_streak', '15');
  localStorage.setItem('treeProgress_bestStreak', '20');
  localStorage.setItem('treeProgress_daysActive', '45');
  console.log("🔥 Set streak to 15, best streak to 20, days active to 45 - Reload page to see ProgressStats");
}

// Test streak milestones
function testStreakMilestones() {
  localStorage.setItem('treeProgress_streak', '7');
  localStorage.setItem('treeProgress_bestStreak', '30');
  localStorage.setItem('treeProgress_daysActive', '100');
  console.log("🏆 Set streak 7, best streak 30, days active 100 - Reload page to see ProgressStats");
}

// =============================================================================
// 6. QUICK TEST SEQUENCE - Chạy để xem tất cả stages
// =============================================================================

function runQuickTestSequence() {
  console.log("🌳 Starting quick test sequence...");
  console.log("1. Copy và paste từng command sau để test:");
  console.log("   testSeedStage()");
  console.log("   testSproutStage()"); 
  console.log("   testSaplingStage()");
  console.log("   testYoungTreeStage()");
  console.log("   testAncientTreeStage()");
  console.log("   testDeadTree()");
  console.log("   testNearRevival()");
  console.log("2. Sau mỗi command, reload page để xem thay đổi");
  console.log("3. Dùng resetToSeed() để reset về ban đầu");
}

// =============================================================================
// 7. CUSTOM SETTINGS
// =============================================================================

// Custom set health (0-500+ với 2 chữ số thập phân)
function setCustomHealth(health) {
  const formattedHealth = parseFloat(health).toFixed(2);
  localStorage.setItem('treeProgress_absoluteHealth', formattedHealth);
  console.log(`🌳 Set custom health to ${formattedHealth} - Reload page`);
}

// Custom set streak values
function setCustomStreak(streak, bestStreak, daysActive) {
  localStorage.setItem('treeProgress_streak', streak.toString());
  localStorage.setItem('treeProgress_bestStreak', (bestStreak || streak).toString());
  localStorage.setItem('treeProgress_daysActive', (daysActive || streak).toString());
  console.log(`� Set streak to ${streak}, best streak to ${bestStreak || streak}, days active to ${daysActive || streak} - Reload page`);
}

// Custom set drops (0-9.9 - vì 10+ sẽ auto tưới)
function setCustomDrops(drops) {
  if (drops >= 10) {
    console.log("⚠️ Warning: Drops >= 10 sẽ auto-tưới sau 1s");
  }
  localStorage.setItem('treeProgress_waterDrops', drops.toString());
  console.log(`💧 Set custom drops to ${drops} - Reload page`);
}

// =============================================================================
// 8. EXPORT FUNCTIONS TO GLOBAL
// =============================================================================

// Make functions available in console
window.treeTest = {
  viewCurrentState,
  resetToSeed,
  testSeedStage,
  testSproutStage,
  testSaplingStage,
  testYoungTreeStage,
  testAncientTreeStage,
  testDeadTree,
  testNearRevival,
  testManyDrops,
  testReadyToWater,
  testHighStreak,
  testStreakMilestones,
  testConsecutiveDay,
  testBrokenStreak,
  testSameDay,
  testFirstTime,
  runQuickTestSequence,
  setCustomHealth,
  setCustomDrops,
  setCustomStreak
};

console.log("🌳 All functions available via window.treeTest");
console.log("Example: treeTest.testSproutStage()");

// =============================================================================
// QUICK COMMANDS TO COPY-PASTE
// =============================================================================

/*

// XEM TRẠNG THÁI HIỆN TẠI
viewCurrentState()

// RESET VỀ BAN ĐẦU  
resetToSeed()

// TEST CÁC STAGE
testSeedStage()
testSproutStage()
testSaplingStage()
testYoungTreeStage()
testAncientTreeStage()

// TEST CHẾT VÀ HỒI SINH
testDeadTree()
testNearRevival()

// TEST WATER DROPS VÀ STREAK
testManyDrops()        // 9.5 drops (gần đủ tưới)
testReadyToWater()     // 10 drops (auto-tưới)
testHighStreak()       // Streak 15, best 20, days 45
testStreakMilestones() // Streak 7, best 30, days 100

// TEST STREAK SCENARIOS (sau đó tick task để thấy kết quả)
testConsecutiveDay()   // Yesterday → streak tăng
testBrokenStreak()     // 3 days ago → streak reset
testSameDay()          // Now → không thay đổi
testFirstTime()        // First user → all = 1

// CUSTOM SETTINGS
setCustomHealth(250.75)   // Health với 2 chữ số thập phân
setCustomDrops(8.5)       // 8.5 drops (safe, không auto-tưới)
setCustomStreak(10, 25, 60) // Current 10, best 25, days 60

// XEM TẤT CẢ FUNCTIONS
runQuickTestSequence()

*/
