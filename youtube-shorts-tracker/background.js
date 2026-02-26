// 탭 업데이트 감시
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 페이지 로딩이 완료되었을 때만 실행
    if (changeInfo.status === 'complete' && tab.url?.includes("youtube.com/shorts/")) {
        // 작동 스위치가 켜져 있는지 먼저 확인
        chrome.storage.local.get(['isActive'], (result) => {
            if (result.isActive !== false) { // 기본값은 true로 간주
                checkDuration(tabId, tab.url);
            }
        });
    }
});

// 3초 체류 확인 함수
async function checkDuration(tabId, url) {
    setTimeout(async () => {
        try {
            const tab = await chrome.tabs.get(tabId);
            if (tab && tab.url === url) {
                const today = new Date().toISOString().split('T')[0];
                
                chrome.storage.local.get(['history', 'shortsLimit', 'isActive'], (data) => {
                    // 실행 도중 스위치가 꺼졌을 가능성 한 번 더 체크
                    if (data.isActive === false) return;

                    let history = data.history || {};
                    let currentCount = history[today] || 0;
                    let newCount = currentCount + 1;
                    
                    history[today] = newCount;
                    chrome.storage.local.set({ history: history });

                    if (data.shortsLimit && newCount === parseInt(data.shortsLimit)) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icon.png',
                            title: '시청 기록 알림',
                            message: `오늘 설정한 ${data.shortsLimit}개를 시청했습니다. 잠시 휴식을 취해보세요!`,
                            priority: 2
                        });
                    }
                });
            }
        } catch (e) {}
    }, 3000);
}