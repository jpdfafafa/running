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
    const subNav = document.getElementById('subNav');
    const navButtons = subNav.querySelectorAll('button[data-target]');
    const sections = document.querySelectorAll('main .content');
    const moreModal = document.getElementById('moreModal');
    const closeMore = document.getElementById('closeMore');
    const registerBtn = document.getElementById('registerBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    // 用户数据存储
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = null; // 当前登录用户

    // 加载用户数据
    function loadUserData() {
        if (!currentUser) return;
        
        // 加载用户的跑步记录
        const userRecordsKey = `userRecords_${currentUser}`;
        records = JSON.parse(localStorage.getItem(userRecordsKey)) || [];
        updateRecordsDisplay();
        
        // 加载用户的跑步计划
        const userPlansKey = `userPlans_${currentUser}`;
        const savedPlans = JSON.parse(localStorage.getItem(userPlansKey)) || [];
        if (savedPlans.length > 0) {
            const planResult = document.getElementById('planResult');
            const planComment = document.getElementById('planComment');
            if (planResult && planComment) {
                const latestPlan = savedPlans[savedPlans.length - 1];
                planResult.innerHTML = latestPlan.plan;
                planComment.textContent = latestPlan.comment;
            }
        }
        
        console.log('已加载用户数据:', currentUser);
    }

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
        
        // 清除之前的消息
        loginMessage.textContent = '';
        loginMessage.style.color = '#ff6b6b';
        
        // 验证用户
        if (!users[username]) {
            loginMessage.textContent = '请先注册账户';
            shakeElement(loginForm);
            return;
        }
        
        if (users[username] !== password) {
            loginMessage.textContent = '密码错误';
            shakeElement(loginForm);
            return;
        }
        
        // 登录成功
        loginMessage.textContent = '登录成功！';
        loginMessage.style.color = '#4CAF50';
        
        // 设置当前用户
        currentUser = username;
        
        // 加载用户数据
        loadUserData();
        
        // 添加登录成功动画
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
            }, 100);
        }, 600);
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

    // 注册表单提交验证
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // 清除之前的消息
        registerMessage.textContent = '';
        registerMessage.style.color = '#ff6b6b';
        
        // 验证输入
        if (username.length < 3) {
            registerMessage.textContent = '用户名至少需要3个字符';
            shakeElement(registerForm);
            return;
        }
        
        if (password.length < 6) {
            registerMessage.textContent = '密码至少需要6个字符';
            shakeElement(registerForm);
            return;
        }
        
        if (password !== confirmPassword) {
            registerMessage.textContent = '两次输入的密码不一致';
            shakeElement(registerForm);
            return;
        }
        
        if (users[username]) {
            registerMessage.textContent = '用户名已存在';
            shakeElement(registerForm);
            return;
        }
        
        // 注册成功
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        
        registerMessage.textContent = '注册成功！请登录';
        registerMessage.style.color = '#4CAF50';
        
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
        
        // 2秒后自动返回登录界面
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
                    
                    // 清空注册表单
                    registerForm.reset();
                    registerMessage.textContent = '';
                }, 100);
            }, 400);
        }, 2000);
    });

    // 震动效果函数
    function shakeElement(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // 添加震动动画样式
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

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
                    
                    // 保存到当前用户的localStorage
                    if (currentUser) {
                        const userPlansKey = `userPlans_${currentUser}`;
                        const savedPlans = JSON.parse(localStorage.getItem(userPlansKey)) || [];
                        savedPlans.push({
                            plan: plan,
                            comment: comment,
                            createdAt: new Date().toISOString()
                        });
                        localStorage.setItem(userPlansKey, JSON.stringify(savedPlans));
                    }
                    
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

    // 记录存储功能
    let records = [];
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
            notes: e.target.elements[2].value
        };
        
        records.push(newRecord);
        
        // 保存到当前用户的localStorage
        if (currentUser) {
            const userRecordsKey = `userRecords_${currentUser}`;
            localStorage.setItem(userRecordsKey, JSON.stringify(records));
        }
        
        updateRecordsDisplay(newRecord);
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

    function updateRecordsDisplay(newRecord = null) {
        const recordsList = document.getElementById('recordsList');
        const html = records.map((record, index) => `
            <div class="record-item" style="animation-delay: ${index * 0.1}s">
                <h4>${record.date}</h4>
                <p>时长: ${record.duration}小时</p>
                <p>${record.notes}</p>
            </div>
        `).join('');
        
        if (newRecord) {
            // 如果是新记录，添加动画效果
            recordsList.style.opacity = '0';
            recordsList.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                recordsList.innerHTML = html;
                recordsList.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                recordsList.style.opacity = '1';
                recordsList.style.transform = 'translateY(0)';
                
                // 为新记录添加特殊动画
                const newRecordElement = recordsList.lastElementChild;
                if (newRecordElement) {
                    newRecordElement.style.background = 'linear-gradient(135deg, rgba(76,175,80,0.1), rgba(76,175,80,0.05))';
                    newRecordElement.style.borderLeftColor = '#4CAF50';
                    newRecordElement.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        newRecordElement.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        newRecordElement.style.transform = 'translateX(0)';
                    }, 100);
                }
            }, 300);
        } else {
            recordsList.innerHTML = html;
        }
    }
});
