#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

async function testAuth() {
  console.log('🧪 Testing note.com authentication...');
  
  // プロジェクトディレクトリの.note-state.jsonを使う
  const statePath = '.note-state.json';
  console.log('📁 Testing with project directory .note-state.json');
  
  if (!fs.existsSync(statePath)) {
    console.error('❌ .note-state.json not found');
    process.exit(1);
  }

  const browser = await chromium.launch({
    headless: true, // GitHub Actionsと同じheadlessモードでテスト
    args: [
      '--lang=ja-JP',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  try {
    const context = await browser.newContext({
      storageState: statePath,
      locale: 'ja-JP',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    });

    const page = await context.newPage();
    
    // Headless検知を回避
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      // Chrome特有のプロパティを追加
      window.chrome = {
        runtime: {},
      };
      // Permissions APIのモック
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // note.comにアクセス
    console.log('🌐 Navigating to note.com...');
    await page.goto('https://note.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // ログイン状態の確認（より詳細に）
    const loginCheck = await page.evaluate(() => {
      return {
        // ログイン状態の要素
        hasWriteButton: !!document.querySelector('a[href*="/dashboard"]'),
        hasNotificationIcon: !!document.querySelector('[aria-label*="通知"]'),
        // より一般的なチェック
        hasLoginLink: !!document.querySelector('a[href*="/login"]'),
        hasSignupLink: !!document.querySelector('a[href*="/signup"]'),
        // 「記事を書く」ボタン
        hasNoteCreateButton: Array.from(document.querySelectorAll('a')).some(a => a.textContent.includes('記事を書く')),
        // 現在のURL
        currentUrl: window.location.href,
      };
    });
    
    console.log('📊 Login check details:', JSON.stringify(loginCheck, null, 2));
    
    // ログインページ特有の要素がなく、記事を書くボタンがあればログイン済み
    const isLoggedIn = !loginCheck.hasLoginLink || loginCheck.hasNoteCreateButton || loginCheck.hasNotificationIcon;

    console.log(`🔐 Login status on note.com: ${isLoggedIn ? 'Logged in ✅' : 'Not logged in ❌'}`);

    if (!isLoggedIn) {
      console.log('\n⚠️  Authentication failed. Possible reasons:');
      console.log('  1. Session expired');
      console.log('  2. note.com changed authentication method');
      console.log('  3. Cookies/storage state not working');
      await page.screenshot({ path: 'test-auth-error.png', fullPage: true });
      console.log('📸 Screenshot saved: test-auth-error.png');
    } else {
      // エディタにもアクセスしてみる
      console.log('🌐 Navigating to editor...');
      await page.goto('https://editor.note.com/new', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const editorLoaded = await page.evaluate(() => {
        return document.querySelectorAll('textarea, [contenteditable="true"]').length > 0;
      });

      console.log(`📝 Editor loaded: ${editorLoaded ? 'Yes ✅' : 'No ❌'}`);

      if (editorLoaded) {
        console.log('\n✅ Authentication is working correctly!');
      } else {
        console.log('\n⚠️  Logged in but editor not loading');
        await page.screenshot({ path: 'test-editor-error.png', fullPage: true });
        console.log('📸 Screenshot saved: test-editor-error.png');
      }
    }

    console.log('\n👀 Browser will stay open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testAuth().catch(console.error);

