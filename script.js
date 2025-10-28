// script.js
document.addEventListener('DOMContentLoaded', function () {
    const cover = document.getElementById('cover');
    const startBtn = document.getElementById('startBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const subNav = document.getElementById('subNav');
    const navButtons = subNav.querySelectorAll('button[data-target]');
    const sections = document.querySelectorAll('main .content');
    const moreModal = document.getElementById('moreModal');
    const closeMore = document.getElementById('closeMore');

    // “开始”按钮点击后显示登录弹窗
    startBtn.addEventListener('click', function () {
        cover.style.display = 'none';
        loginModal.style.display = 'flex';
    });

    // 登录表单提交后显示功能选择
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        subNav.style.display = 'flex';
    });

    // 功能选择按钮切换子界面
    navButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // 如果是“更多服务”按钮，弹窗显示
            if (btn.getAttribute('data-target') === 'more') {
                moreModal.style.display = 'flex';
                // 取消按钮高亮
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // 隐藏所有内容模块
                sections.forEach(sec => sec.style.display = 'none');
            } else {
                // 隐藏弹窗
                moreModal.style.display = 'none';
                // 隐藏所有内容模块
                sections.forEach(sec => sec.style.display = 'none');
                // 显示对应内容模块
                const targetId = btn.getAttribute('data-target');
                document.getElementById(targetId).style.display = 'block';
                // 高亮当前按钮
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    // 关闭“更多服务”弹窗
    closeMore.addEventListener('click', function () {
        moreModal.style.display = 'none';
        // 取消“更多服务”按钮高亮
        navButtons.forEach(b => b.classList.remove('active'));
    });

    // 计划生成表单逻辑
    const planForm = document.getElementById('planForm');
    const planResult = document.getElementById('planResult');
    const planComment = document.getElementById('planComment');

    if (planForm) {
        planForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);

            // 简单计划生成示例
            let plan = '';
            if (height && weight) {
                plan = `
                    <h3>您的专属跑步计划</h3>
                    <ul>
                        <li>每周跑步3-5次，每次30-60分钟。</li>
                        <li>建议配速：6-8分钟/公里。</li>
                        <li>根据体能情况逐步增加跑步距离。</li>
                        <li>跑步前后做好热身和拉伸。</li>
                    </ul>
                `;
                // 评价逻辑
                const bmi = weight / Math.pow(height / 100, 2);
                let comment = '';
                if (bmi < 18.5) {
                    comment = '您的体重偏轻，建议适当增加营养摄入，跑步时注意强度，避免过度消耗。';
                } else if (bmi < 24) {
                    comment = '您的身高体重较为标准，可以正常进行跑步锻炼，建议保持良好生活习惯。';
                } else if (bmi < 28) {
                    comment = '您的体重略高，建议结合饮食控制和有氧运动，跑步时注意关节保护。';
                } else {
                    comment = '您的体重偏高，建议先以快走或低强度慢跑为主，必要时咨询医生后再进行高强度锻炼。';
                }
                planResult.innerHTML = plan;
                planComment.textContent = comment;
            } else {
                planResult.innerHTML = '';
                planComment.textContent = '';
            }
        });
    }

    // 记录存储功能
    let records = [];
    document.getElementById('recordForm').addEventListener('submit', e => {
        e.preventDefault();
        const newRecord = {
            date: e.target.elements[0].value,
            duration: e.target.elements[1].value,
            notes: e.target.elements[2].value
        };
        
        records.push(newRecord);
        updateRecordsDisplay();
        e.target.reset();
    });

    function updateRecordsDisplay() {
        const html = records.map(record => `
            <div class="record-item">
                <h4>${record.date}</h4>
                <p>时长: ${record.duration}小时</p>
                <p>${record.notes}</p>
            </div>
        `).join('');
        document.getElementById('recordsList').innerHTML = html;
    }
});
