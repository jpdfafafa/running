// script.js
document.addEventListener('DOMContentLoaded', function () {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // 添加鼠标跟随粒子效果
    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.animation = 'particleFade 1s ease-out forwards';
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    };

    // 添加粒子淡出动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFade {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 鼠标移动时创建粒子效果
    let particleTimer;
    document.addEventListener('mousemove', (e) => {
        clearTimeout(particleTimer);
        particleTimer = setTimeout(() => {
            if (Math.random() > 0.9) {
                createParticle(e.clientX, e.clientY);
            }
        }, 50);
    });

    const cover = document.getElementById('cover');
    const startBtn = document.getElementById('startBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const subNav = document.getElementById('subNav');
    const navButtons = subNav.querySelectorAll('button[data-target]');
    const sections = document.querySelectorAll('main .content');
    const moreModal = document.getElementById('moreModal');
    const closeMore = document.getElementById('closeMore');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    // 用户管理功能
    class UserManager {
        constructor() {
            this.users = JSON.parse(localStorage.getItem('users')) || {};
            this.currentUser = null;
        }

        // 注册用户
        register(username, password) {
            if (this.users[username]) {
                return { success: false, message: '用户名已存在' };
            }
            
            if (password.length < 6) {
                return { success: false, message: '密码长度至少6位' };
            }

            this.users[username] = {
                password: password,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(this.users));
            return { success: true, message: '注册成功' };
        }

        // 验证登录
        login(username, password) {
            if (!this.users[username]) {
                return { success: false, message: '请先注册账户' };
            }

            if (this.users[username].password !== password) {
                return { success: false, message: '密码错误' };
            }

            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            return { success: true, message: '登录成功' };
        }

        // 登出
        logout() {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        }

        // 获取当前用户
        getCurrentUser() {
            if (!this.currentUser) {
                this.currentUser = localStorage.getItem('currentUser');
            }
            return this.currentUser;
        }

        // 获取用户跑步记录
        getUserRunningRecords() {
            const username = this.getCurrentUser();
            if (!username) return [];
            return JSON.parse(localStorage.getItem(`runningRecords_${username}`) || '[]');
        }

        // 保存用户跑步记录
        saveUserRunningRecords(records) {
            const username = this.getCurrentUser();
            if (!username) return false;
            localStorage.setItem(`runningRecords_${username}`, JSON.stringify(records));
            return true;
        }

        // 获取用户跑步计划
        getUserRunningPlans() {
            const username = this.getCurrentUser();
            if (!username) return [];
            return JSON.parse(localStorage.getItem(`runningPlans_${username}`) || '[]');
        }

        // 保存用户跑步计划
        saveUserRunningPlans(plans) {
            const username = this.getCurrentUser();
            if (!username) return false;
            localStorage.setItem(`runningPlans_${username}`, JSON.stringify(plans));
            return true;
        }
    }

    const userManager = new UserManager();

    // “开始”按钮点击后显示登录弹窗
    startBtn.addEventListener('click', function () {
        // 添加按钮点击动画效果
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 创建爆炸粒子效果
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / 20;
                const distance = 100 + Math.random() * 50;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                createParticle(x, y);
            }, i * 30);
        }
        
        // 页面切换动画
        cover.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cover.style.transform = 'scale(0.8) rotateY(90deg)';
        cover.style.opacity = '0';
        
        setTimeout(() => {
            cover.style.display = 'none';
            loginModal.style.display = 'flex';
            loginModal.style.opacity = '0';
            loginModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                loginModal.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                loginModal.style.opacity = '1';
                loginModal.style.transform = 'scale(1)';
            }, 100);
        }, 600);
    });

    // 登录表单提交验证
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 验证登录
        const result = userManager.login(username, password);
        
        // 显示消息
        loginMessage.textContent = result.message;
        loginMessage.className = 'message ' + (result.success ? 'success' : 'error');
        
        if (result.success) {
            // 登录成功，显示功能选择界面
            const loginBox = document.querySelector('.login-box');
            loginBox.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            loginBox.style.transform = 'scale(0.8) rotateY(90deg)';
            loginBox.style.opacity = '0';
            
            // 创建成功粒子效果
            const rect = loginBox.getBoundingClientRect();
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 200;
                    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 200;
                    createParticle(x, y);
                }, i * 20);
            }
            
            setTimeout(() => {
                loginModal.style.display = 'none';
                subNav.style.display = 'flex';
                subNav.style.opacity = '0';
                subNav.style.transform = 'translateY(30px) scale(0.9)';
                
                setTimeout(() => {
                    subNav.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    subNav.style.opacity = '1';
                    subNav.style.transform = 'translateY(0) scale(1)';
                    
                    // 加载用户数据
                    loadRunningRecords();
                    loadRunningPlans();
                }, 100);
            }, 600);
        }
    });

    // 功能选择按钮切换子界面
    navButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // 添加按钮点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // 创建点击粒子效果
            const rect = this.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const x = rect.left + Math.random() * rect.width;
                    const y = rect.top + Math.random() * rect.height;
                    createParticle(x, y);
                }, i * 30);
            }
            
            // 如果是"更多服务"按钮，弹窗显示
            if (btn.getAttribute('data-target') === 'more') {
                moreModal.style.display = 'flex';
                moreModal.style.opacity = '0';
                moreModal.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    moreModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    moreModal.style.opacity = '1';
                    moreModal.style.transform = 'scale(1)';
                }, 100);
                
                // 取消按钮高亮
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // 隐藏所有内容模块
                sections.forEach(sec => sec.style.display = 'none');
            } else {
                // 隐藏弹窗
                moreModal.style.display = 'none';
                // 隐藏所有内容模块
                sections.forEach(sec => {
                    if (sec.style.display === 'block') {
                        sec.style.transition = 'all 0.3s ease-out';
                        sec.style.opacity = '0';
                        sec.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            sec.style.display = 'none';
                        }, 300);
                    }
                });
                
                // 显示对应内容模块
                const targetId = btn.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                setTimeout(() => {
                    targetSection.style.display = 'block';
                    targetSection.style.opacity = '0';
                    targetSection.style.transform = 'translateY(30px) scale(0.95)';
                    
                    setTimeout(() => {
                        targetSection.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        targetSection.style.opacity = '1';
                        targetSection.style.transform = 'translateY(0) scale(1)';
                        
                        // 根据不同模块加载相应数据
                        if (targetId === 'records') {
                            loadRunningRecords();
                        } else if (targetId === 'plan') {
                            loadRunningPlans();
                        }
                    }, 100);
                }, 350);
                
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

    // 跑步计划相关函数
    function loadRunningPlans() {
        const plans = userManager.getUserRunningPlans();
        const plansList = document.getElementById('plansList');
        
        if (plans.length === 0) {
            plansList.innerHTML = '<p class="no-plans">暂无跑步计划</p>';
            return;
        }
        
        const html = plans.map((plan, index) => `
            <div class="plan-item" style="animation-delay: ${index * 0.1}s">
                <h4>${plan.title}</h4>
                <p>${plan.content}</p>
                <p><strong>评价:</strong> ${plan.comment}</p>
                <p><small>创建时间: ${new Date(plan.createdAt).toLocaleString()}</small></p>
                <button class="delete-btn" onclick="deletePlan(${index})">删除</button>
            </div>
        `).join('');
        
        plansList.innerHTML = html;
    }

    function deletePlan(index) {
        const plans = userManager.getUserRunningPlans();
        plans.splice(index, 1);
        userManager.saveUserRunningPlans(plans);
        loadRunningPlans();
        
        // 创建删除粒子效果
        const plansList = document.getElementById('plansList');
        const rect = plansList.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 60;
                createParticle(x, y);
            }, i * 25);
        }
    }

    if (planForm) {
        planForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // 添加表单提交动画
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.style.transform = 'scale(0.95)';
            submitBtn.textContent = '生成中...';
            
            setTimeout(() => {
                submitBtn.style.transform = '';
                submitBtn.textContent = '生成计划';
            }, 1000);
            
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
                
                // 保存计划到用户数据
                const newPlan = {
                    title: '您的专属跑步计划',
                    content: plan.replace(/<[^>]*>/g, '').replace(/\n\s+/g, '\n').trim(),
                    comment: comment,
                    height: height,
                    weight: weight,
                    bmi: bmi.toFixed(1),
                    createdAt: new Date().toISOString()
                };
                
                const plans = userManager.getUserRunningPlans();
                plans.push(newPlan);
                userManager.saveUserRunningPlans(plans);
                
                // 添加结果动画
                planResult.style.opacity = '0';
                planResult.style.transform = 'translateY(20px)';
                planComment.style.opacity = '0';
                planComment.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    planResult.innerHTML = plan;
                    planResult.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    planResult.style.opacity = '1';
                    planResult.style.transform = 'translateY(0)';
                    
                    planComment.textContent = comment;
                    planComment.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    planComment.style.opacity = '1';
                    planComment.style.transform = 'translateY(0)';
                    
                    // 创建成功粒子效果
                    const rect = submitBtn.getBoundingClientRect();
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => {
                            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
                            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
                            createParticle(x, y);
                        }, i * 40);
                    }
                }, 500);
            } else {
                planResult.innerHTML = '';
                planComment.textContent = '';
            }
        });
    }

    // 跑步记录相关函数
    function loadRunningRecords() {
        const records = userManager.getUserRunningRecords();
        const recordsList = document.getElementById('recordsList');
        
        if (records.length === 0) {
            recordsList.innerHTML = '<p class="no-records">暂无跑步记录</p>';
            return;
        }
        
        const html = records.map((record, index) => `
            <div class="record-item" style="animation-delay: ${index * 0.1}s">
                <h4>${record.date}</h4>
                <p>时长: ${record.duration}小时</p>
                <p>${record.notes}</p>
                <button class="delete-btn" onclick="deleteRecord(${index})">删除</button>
            </div>
        `).join('');
        
        recordsList.innerHTML = html;
    }

    function deleteRecord(index) {
        const records = userManager.getUserRunningRecords();
        records.splice(index, 1);
        userManager.saveUserRunningRecords(records);
        loadRunningRecords();
        
        // 创建删除粒子效果
        const recordsList = document.getElementById('recordsList');
        const rect = recordsList.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 60;
                createParticle(x, y);
            }, i * 25);
        }
    }

    // 记录存储功能
    document.getElementById('recordForm').addEventListener('submit', e => {
        e.preventDefault();
        
        // 添加表单提交动画
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.style.transform = 'scale(0.95)';
        submitBtn.textContent = '添加中...';
        
        setTimeout(() => {
            submitBtn.style.transform = '';
            submitBtn.textContent = '添加记录';
        }, 800);
        
        const newRecord = {
            date: e.target.elements[0].value,
            duration: e.target.elements[1].value,
            notes: e.target.elements[2].value,
            createdAt: new Date().toISOString()
        };
        
        // 获取当前用户的记录并添加新记录
        const records = userManager.getUserRunningRecords();
        records.push(newRecord);
        userManager.saveUserRunningRecords(records);
        
        // 更新显示
        loadRunningRecords();
        e.target.reset();
        
        // 创建成功粒子效果
        const rect = submitBtn.getBoundingClientRect();
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 80;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 80;
                createParticle(x, y);
            }, i * 35);
        }
    });

    // 注册按钮点击事件
    registerBtn.addEventListener('click', function () {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 切换到注册界面
        loginModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        loginModal.style.opacity = '0';
        loginModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
            registerModal.style.opacity = '0';
            registerModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                registerModal.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                registerModal.style.opacity = '1';
                registerModal.style.transform = 'scale(1)';
            }, 100);
        }, 400);
    });

    // 返回登录按钮点击事件
    backToLoginBtn.addEventListener('click', function () {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 切换回登录界面
        registerModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        registerModal.style.opacity = '0';
        registerModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
            loginModal.style.opacity = '0';
            loginModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                loginModal.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                loginModal.style.opacity = '1';
                loginModal.style.transform = 'scale(1)';
            }, 100);
        }, 400);
    });

    // 注册表单提交事件
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // 验证密码确认
        if (password !== confirmPassword) {
            registerMessage.textContent = '两次输入的密码不一致';
            registerMessage.className = 'message error';
            return;
        }
        
        // 注册用户
        const result = userManager.register(username, password);
        
        // 显示消息
        registerMessage.textContent = result.message;
        registerMessage.className = 'message ' + (result.success ? 'success' : 'error');
        
        if (result.success) {
            // 注册成功，清空表单并延迟返回登录
            registerForm.reset();
            
            // 创建成功粒子效果
            const registerBox = document.querySelector('.register-box');
            const rect = registerBox.getBoundingClientRect();
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 150;
                    const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 150;
                    createParticle(x, y);
                }, i * 30);
            }
            
            // 延迟返回登录界面
            setTimeout(() => {
                registerModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                registerModal.style.opacity = '0';
                registerModal.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    registerModal.style.display = 'none';
                    loginModal.style.display = 'flex';
                    loginModal.style.opacity = '0';
                    loginModal.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        loginModal.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        loginModal.style.opacity = '1';
                        loginModal.style.transform = 'scale(1)';
                        
                        // 清空注册消息
                        registerMessage.textContent = '';
                        registerMessage.className = 'message';
                    }, 100);
                }, 400);
            }, 1500);
        }
    });
});
