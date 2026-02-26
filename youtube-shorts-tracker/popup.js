document.addEventListener('DOMContentLoaded', () => {
    const tabs = { home: document.getElementById('tab-home'), stats: document.getElementById('tab-stats') };
    const tabBtns = { home: document.getElementById('tab-home-btn'), stats: document.getElementById('tab-stats-btn') };
    const countDisplay = document.getElementById('count');
    const limitInput = document.getElementById('limit');
    const saveBtn = document.getElementById('save-limit');
    const resetBtn = document.getElementById('reset-all');
    const chartContainer = document.getElementById('chart-container');
    const masterSwitch = document.getElementById('master-switch');
    const statusText = document.getElementById('status-text');

    // UI 상태 업데이트 (홈 탭만 On/Off 영향 받음)
    const updateUIState = (isActive) => {
        // 홈 탭에만 비활성화 클래스 토글
        tabs.home.classList.toggle('is-off', !isActive);
        
        statusText.textContent = isActive ? "켜짐" : "꺼짐";
        statusText.classList.toggle('text-green', isActive);
        statusText.classList.toggle('text-gray', !isActive);
        
        // 홈 탭 내부의 입력창 및 버튼 비활성화 처리
        limitInput.disabled = !isActive;
        saveBtn.disabled = !isActive;
    };

    // 스위치 이벤트
    masterSwitch.addEventListener('change', () => {
        const isActive = masterSwitch.checked;
        chrome.storage.local.set({ isActive: isActive }, () => {
            updateUIState(isActive);
        });
    });

    // 탭 전환 (스위치 상태와 상관없이 항상 가능)
    const switchTab = (tabName) => {
        Object.keys(tabs).forEach(key => {
            tabs[key].classList.toggle('hidden', key !== tabName);
            tabBtns[key].classList.toggle('tab-active', key === tabName);
        });
        if (tabName === 'stats') renderChart();
    };

    tabBtns.home.addEventListener('click', () => switchTab('home'));
    tabBtns.stats.addEventListener('click', () => switchTab('stats'));

    // 차트 렌더링
    const renderChart = () => {
        chrome.storage.local.get(['history'], (result) => {
            const history = result.history || {};
            chartContainer.innerHTML = '';
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                last7Days.push(d.toISOString().split('T')[0]);
            }

            const values = last7Days.map(date => history[date] || 0);
            const maxVal = Math.max(...values, 5);
            let total = 0;

            last7Days.forEach((date, i) => {
                const val = values[i];
                total += val;
                const height = (val / maxVal) * 100;
                const dayLabel = date.split('-')[2];

                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${height}%`;
                bar.innerHTML = `<span class="bar-value">${val}</span><span class="bar-label">${dayLabel}일</span>`;
                chartContainer.appendChild(bar);
            });
            document.getElementById('weekly-total').textContent = `${total}개`;
        });
    };

    // 제한 설정 저장
    saveBtn.addEventListener('click', () => {
        const limitValue = parseInt(limitInput.value);
        if (isNaN(limitValue)) return;
        chrome.storage.local.set({ shortsLimit: limitValue }, () => {
            const originalText = saveBtn.innerText;
            saveBtn.innerText = "저장됨";
            setTimeout(() => saveBtn.innerText = originalText, 2000);
        });
    });

    // 초기화
    resetBtn.addEventListener('click', () => {
        if(confirm('모든 시청 기록이 삭제됩니다. 계속하시겠습니까?')) {
            chrome.storage.local.set({ history: {} }, () => {
                // 현재 페이지 로직 유지하며 갱신
                countDisplay.textContent = '0';
                renderChart();
                if (tabs.stats.classList.contains('hidden')) {
                   switchTab('home');
                }
            });
        }
    });

    // 실시간 데이터 동기화 리스너
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            if (changes.history) {
                const today = new Date().toISOString().split('T')[0];
                const newHistory = changes.history.newValue || {};
                countDisplay.textContent = newHistory[today] || 0;
                if (!tabs.stats.classList.contains('hidden')) {
                    renderChart();
                }
            }
            if (changes.isActive) {
                masterSwitch.checked = changes.isActive.newValue;
                updateUIState(changes.isActive.newValue);
            }
        }
    });

    // 초기 데이터 로드
    const today = new Date().toISOString().split('T')[0];
    chrome.storage.local.get(['history', 'shortsLimit', 'isActive'], (result) => {
        const history = result.history || {};
        countDisplay.textContent = history[today] || 0;
        limitInput.value = result.shortsLimit || '';
        
        const active = result.isActive !== false;
        masterSwitch.checked = active;
        updateUIState(active);
    });
});