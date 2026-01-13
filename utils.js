export async function login(page, username, password) {
  await page.goto("url_of_your_login_page");
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}
