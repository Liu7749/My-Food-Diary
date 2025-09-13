document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const entriesContainer = document.getElementById('entriesContainer');
    const entryForm = document.getElementById('entryForm');
    const addEntryBtn = document.getElementById('addEntryBtn');
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const entryIdInput = document.getElementById('entryId');
    const entryDateInput = document.getElementById('entryDate');
    const entryTitleInput = document.getElementById('entryTitle');
    const entryContentInput = document.getElementById('entryContent');

    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    entryDateInput.value = today;

    // 初始化日记列表
    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    
    // 如果没有现有日记，添加一些示例数据
    if (entries.length === 0) {
        const sampleEntries = [
            {
                id: '1',
                date: '2024-05-10',
                title: '春天的早晨',
                content: '今天早上起床，看到窗外的花开了。阳光透过窗户洒进房间，心情特别好。决定今天去公园散步，享受这美好的春天。'
            },
            {
                id: '2',
                date: '2024-05-08',
                title: '学习新技能',
                content: '开始学习JavaScript，这是一门非常有趣的编程语言。今天学习了DOM操作，感觉收获满满。虽然有些地方还不太明白，但我相信通过不断练习，一定能掌握它。'
            },
            {
                id: '3',
                date: '2024-05-05',
                title: '周末的电影',
                content: '今天和朋友一起看了一部很棒的电影。电影讲述了一个关于友情和成长的故事，让我深受感动。看完电影后，我们一起去吃了火锅，度过了一个愉快的周末。'
            }
        ];
        entries = sampleEntries;
        saveEntries();
    }

    // 渲染日记列表
    function renderEntries(filteredEntries = null) {
        entriesContainer.innerHTML = '';
        
        const entriesToRender = filteredEntries || entries;
        
        if (entriesToRender.length === 0) {
            // 显示空状态
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <h3>还没有日记哦</h3>
                <p>点击"写新日记"开始记录你的生活吧！</p>
            `;
            entriesContainer.appendChild(emptyState);
            return;
        }

        // 按日期倒序排序（最新的在前）
        entriesToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 创建日记卡片
        entriesToRender.forEach(entry => {
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card';
            entryCard.innerHTML = `
                <div class="entry-date">${formatDate(entry.date)}</div>
                <h3 class="entry-title">${entry.title}</h3>
                <p class="entry-content">${entry.content}</p>
                <div class="entry-actions">
                    <button class="btn" onclick="editEntry('${entry.id}')">编辑</button>
                    <button class="btn secondary" onclick="deleteEntry('${entry.id}')">删除</button>
                </div>
            `;
            entriesContainer.appendChild(entryCard);
        });
    }

    // 格式化日期显示
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('zh-CN', options);
    }

    // 添加新日记
    function addNewEntry() {
        // 重置表单
        entryIdInput.value = '';
        entryTitleInput.value = '';
        entryContentInput.value = '';
        entryDateInput.value = today;
        
        // 显示表单
        entryForm.classList.remove('hidden');
        entriesContainer.classList.add('hidden');
    }

    // 编辑日记
    window.editEntry = function(id) {
        const entry = entries.find(e => e.id === id);
        if (entry) {
            entryIdInput.value = entry.id;
            entryDateInput.value = entry.date;
            entryTitleInput.value = entry.title;
            entryContentInput.value = entry.content;
            
            // 显示表单
            entryForm.classList.remove('hidden');
            entriesContainer.classList.add('hidden');
        }
    }

    // 删除日记
    window.deleteEntry = function(id) {
        if (confirm('确定要删除这篇日记吗？')) {
            entries = entries.filter(entry => entry.id !== id);
            saveEntries();
            renderEntries();
        }
    }

    // 保存日记
    function saveEntry() {
        const id = entryIdInput.value || Date.now().toString();
        const date = entryDateInput.value;
        const title = entryTitleInput.value.trim();
        const content = entryContentInput.value.trim();

        // 验证输入
        if (!title || !content || !date) {
            alert('请填写所有必填字段');
            return;
        }

        // 检查是否是编辑现有日记
        const existingIndex = entries.findIndex(entry => entry.id === id);
        
        if (existingIndex >= 0) {
            // 更新现有日记
            entries[existingIndex] = { id, date, title, content };
        } else {
            // 添加新日记
            entries.push({ id, date, title, content });
        }

        // 保存到localStorage
        saveEntries();

        // 返回日记列表
        cancelEditing();
    }

    // 保存日记数组到localStorage
    function saveEntries() {
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }

    // 取消编辑
    function cancelEditing() {
        entryForm.classList.add('hidden');
        entriesContainer.classList.remove('hidden');
        renderEntries();
    }

    // 搜索日记
    function searchEntries() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            renderEntries();
            return;
        }

        const filteredEntries = entries.filter(entry => 
            entry.title.toLowerCase().includes(searchTerm) || 
            entry.content.toLowerCase().includes(searchTerm) ||
            entry.date.includes(searchTerm)
        );

        renderEntries(filteredEntries);
    }

    // 添加事件监听器
    addEntryBtn.addEventListener('click', addNewEntry);
    saveEntryBtn.addEventListener('click', saveEntry);
    cancelBtn.addEventListener('click', cancelEditing);
    searchBtn.addEventListener('click', searchEntries);
    
    // 搜索框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchEntries();
        }
    });

    // 初始化渲染
    renderEntries();
});