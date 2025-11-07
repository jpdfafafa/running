// script.js
document.addEventListener('DOMContentLoaded', function () {
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // 粒子效果
    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        Object.assign(particle.style, {
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            width: '4px',
            height: '4px',
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9999',
            animation: 'particleFade 1s ease-out forwards'
        });
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    };

    // 添加粒子动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFade {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // 粒子效果事件监听
    let particleTimer;
    const createParticleOnMove = (clientX, clientY, threshold = 0.9) => {
        clearTimeout(particleTimer);
        particleTimer = setTimeout(() => {
            if (Math.random() > threshold) createParticle(clientX, clientY);
        }, 50);
    };

    document.addEventListener('mousemove', (e) => createParticleOnMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            createParticleOnMove(touch.clientX, touch.clientY, 0.8);
        }
    }, { passive: true });

    const cover = document.getElementById('cover');
    const startBtn = document.getElementById('startBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
    const subNav = document.getElementById('subNav');
    const navButtons = subNav.querySelectorAll('button[data-target]');
    const sections = document.querySelectorAll('main .content');
    const moreModal = document.getElementById('moreModal');
    const closeMore = document.getElementById('closeMore');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');

    // 用户数据存储（使用localStorage持久化）
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let currentUser = null; // 当前登录用户

    // "开始"按钮点击后显示登录弹窗
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
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // 清除之前的消息
        loginMessage.textContent = '';
        loginMessage.style.color = '#ff6b6b';
        
        // 验证用户名是否存在
        if (!users[username]) {
            loginMessage.textContent = '请先注册账户';
            loginMessage.style.color = '#ff6b6b';
            
            // 添加错误动画
            const loginBox = document.querySelector('.login-box');
            loginBox.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginBox.style.animation = '';
            }, 500);
            return;
        }
        
        // 验证密码是否正确
        if (users[username] !== password) {
            loginMessage.textContent = '密码错误';
            loginMessage.style.color = '#ff6b6b';
            
            // 添加错误动画
            const loginBox = document.querySelector('.login-box');
            loginBox.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginBox.style.animation = '';
            }, 500);
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

    // 取消注册按钮点击事件
    cancelRegisterBtn.addEventListener('click', function () {
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
        
        // 清空注册表单和消息
        registerForm.reset();
        registerMessage.textContent = '';
    });

    // 注册表单提交验证
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // 清除之前的消息
        registerMessage.textContent = '';
        registerMessage.style.color = '#ff6b6b';
        
        // 验证用户名是否为空
        if (!username) {
            registerMessage.textContent = '请输入用户名';
            shakeRegisterBox();
            return;
        }
        
        // 验证用户名是否已存在
        if (users[username]) {
            registerMessage.textContent = '用户名已存在';
            shakeRegisterBox();
            return;
        }
        
        // 验证密码是否为空
        if (!password) {
            registerMessage.textContent = '请输入密码';
            shakeRegisterBox();
            return;
        }
        
        // 验证密码长度
        if (password.length < 6) {
            registerMessage.textContent = '密码长度至少6位';
            shakeRegisterBox();
            return;
        }
        
        // 验证确认密码
        if (password !== confirmPassword) {
            registerMessage.textContent = '两次输入的密码不一致';
            shakeRegisterBox();
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
        
        // 2秒后自动切换到登录界面
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
                }, 100);
            }, 400);
            
            // 清空注册表单和消息
            registerForm.reset();
            registerMessage.textContent = '';
            
            // 预填用户名到登录表单
            document.getElementById('username').value = username;
            loginMessage.textContent = '注册成功，请登录';
            loginMessage.style.color = '#4CAF50';
        }, 2000);
    });

    // 注册框抖动动画函数
    function shakeRegisterBox() {
        const registerBox = document.querySelector('.register-box');
        registerBox.style.animation = 'shake 0.5s';
        setTimeout(() => {
            registerBox.style.animation = '';
        }, 500);
    }

    // 添加抖动动画样式
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // 用户数据管理函数
    function loadUserData() {
        if (!currentUser) return;
        
        // 加载用户数据
        const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`)) || {
            records: [],
            plans: []
        };
        
        // 更新全局变量
        records = userData.records;
        plans = userData.plans;
        
        // 更新显示
        updateRecordsDisplay();
        updatePlansDisplay();
    }

    function saveUserData() {
        if (!currentUser) return;
        
        const userData = {
            records: records,
            plans: plans
        };
        
        localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
    }

    // 初始化用户数据
    let records = [];
    let plans = [];

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

    // 关闭"更多服务"弹窗
    closeMore.addEventListener('click', function () {
        moreModal.style.display = 'none';
        // 取消"更多服务"按钮高亮
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

            // 丰富的计划生成逻辑
            let plan = '';
            if (height && weight) {
                const bmi = weight / Math.pow(height / 100, 2);
                const idealWeight = (height - 100) * 0.9; // 简易理想体重计算
                const weightDifference = weight - idealWeight;
                
                // 根据不同情况生成多样化计划
                let trainingPlan = [];
                let nutritionAdvice = [];
                let injuryPrevention = [];
                let progressionPlan = [];
                
                // 基础信息分析
                const bodyType = analyzeBodyType(bmi, height, weight);
                const fitnessLevel = estimateFitnessLevel(bmi, height, weight);
                
                // 生成训练计划
                if (bmi < 18.5) {
                    // 偏瘦体质
                    trainingPlan = [
                        '每周跑步3-4次，每次20-40分钟',
                        '以轻松跑为主，配速控制在7-9分钟/公里',
                        '结合力量训练，增加肌肉量',
                        '避免过度训练，保证充足休息'
                    ];
                    nutritionAdvice = [
                        '增加蛋白质摄入：每公斤体重1.6-2.0g蛋白质',
                        '适量增加健康碳水化合物：燕麦、红薯、全麦面包',
                        '少食多餐，每日5-6餐',
                        '补充健康脂肪：坚果、牛油果、橄榄油'
                    ];
                    injuryPrevention = [
                        '注意关节保暖，避免受凉',
                        '选择缓冲性好的跑鞋',
                        '加强下肢力量训练',
                        '定期进行骨密度检查'
                    ];
                } else if (bmi < 24) {
                    // 标准体重
                    trainingPlan = [
                        '每周跑步4-5次，每次30-60分钟',
                        '多样化训练：轻松跑、间歇跑、长距离慢跑结合',
                        '建议配速：5-7分钟/公里',
                        '每月参加一次10公里比赛或测试'
                    ];
                    nutritionAdvice = [
                        '保持均衡饮食，蛋白质、碳水、脂肪比例4:4:2',
                        '多摄入新鲜蔬菜水果',
                        '适量补充复合维生素',
                        '运动前后及时补充能量'
                    ];
                    injuryPrevention = [
                        '定期更换跑鞋（每500-800公里）',
                        '加强核心肌群训练',
                        '学习正确跑步姿势',
                        '充分热身和拉伸'
                    ];
                } else if (bmi < 28) {
                    // 轻度超重
                    trainingPlan = [
                        '每周跑步3-4次，每次20-45分钟',
                        '从快走开始，逐步过渡到慢跑',
                        '建议配速：6-8分钟/公里',
                        '结合游泳、骑行等低冲击运动'
                    ];
                    nutritionAdvice = [
                        '控制总热量摄入，创造300-500卡路里缺口',
                        '减少精制糖和高脂食物',
                        '增加膳食纤维摄入',
                        '多喝水，每日至少2-3升'
                    ];
                    injuryPrevention = [
                        '选择缓震性能好的跑鞋',
                        '控制体重下降速度（每周0.5-1公斤）',
                        '加强膝关节周围肌肉',
                        '避免在硬地面长时间跑步'
                    ];
                } else {
                    // 明显超重
                    trainingPlan = [
                        '每周运动3-4次，每次20-30分钟',
                        '以快走为主，逐步引入慢跑（走跑结合）',
                        '建议配速：8-10分钟/公里（慢跑时）',
                        '水中跑步或椭圆机作为替代运动'
                    ];
                    nutritionAdvice = [
                        '严格控制饮食，咨询营养师制定饮食计划',
                        '采用低GI碳水化合物',
                        '增加饱腹感强的食物：蛋白质、纤维',
                        '记录每日饮食，控制热量摄入'
                    ];
                    injuryPrevention = [
                        '运动前必须进行医学检查',
                        '佩戴护膝等保护装备',
                        '避免跳跃和冲击性动作',
                        '密切关注身体信号，出现不适立即停止'
                    ];
                }
                
                // 生成进阶计划
                if (fitnessLevel === 'beginner') {
                    progressionPlan = [
                        '第1-2周：适应期，每周3次，每次20分钟',
                        '第3-4周：增加频率，每周4次，每次25分钟',
                        '第5-8周：增加强度，加入间歇训练',
                        '第9-12周：准备参加5公里比赛'
                    ];
                } else if (fitnessLevel === 'intermediate') {
                    progressionPlan = [
                        '第1-4周：基础建设，每周4-5次，每次40分钟',
                        '第5-8周：速度训练，每周1次间歇跑',
                        '第9-12周：耐力提升，每月1次长距离',
                        '第13-16周：比赛准备，参加10公里比赛'
                    ];
                } else {
                    progressionPlan = [
                        '第1-4周：高强度训练，每周5-6次',
                        '第5-8周：专项训练，针对比赛项目',
                        '第9-12周：巅峰状态，参加半马或全马',
                        '第13-16周：恢复调整，为下个周期做准备'
                    ];
                }
                
                // 生成个性化建议
                const personalizedTips = generatePersonalizedTips(height, weight, bmi, bodyType);
                
                plan = `
                    <div class="plan-header">
                        <h3>🏃‍♂️ 您的专属跑步计划</h3>
                        <div class="body-analysis">
                            <p><strong>身体分析：</strong>${bodyType.description}</p>
                            <p><strong>BMI指数：</strong>${bmi.toFixed(1)} (${bodyType.category})</p>
                            <p><strong>体能水平：</strong>${fitnessLevel === 'beginner' ? '初学者' : fitnessLevel === 'intermediate' ? '中级' : '高级'}</p>
                        </div>
                    </div>
                    
                    <div class="plan-section">
                        <h4>📋 训练计划</h4>
                        <ul>
                            ${trainingPlan.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="plan-section">
                        <h4>🥗 营养建议</h4>
                        <ul>
                            ${nutritionAdvice.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="plan-section">
                        <h4>🛡️ 伤病预防</h4>
                        <ul>
                            ${injuryPrevention.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="plan-section">
                        <h4>📈 进阶计划</h4>
                        <ul>
                            ${progressionPlan.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="plan-section">
                        <h4>💡 个性化建议</h4>
                        <ul>
                            ${personalizedTips.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
                
                // 生成详细评价
                let comment = generateDetailedComment(bmi, height, weight, bodyType, fitnessLevel, weightDifference);
                
                // 保存计划到用户数据
                const planData = {
                    height: height,
                    weight: weight,
                    plan: plan,
                    comment: comment,
                    createdAt: new Date().toISOString()
                };
                plans.push(planData);
                saveUserData();
                updatePlansDisplay(planData); // 立即更新计划显示并传递新计划
                
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
            notes: e.target.elements[2].value
        };
        
        records.push(newRecord);
        saveUserData(); // 保存用户数据
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
                <div class="record-content">
                    <h4>${record.date}</h4>
                    <p>时长: ${record.duration}小时</p>
                    <p>${record.notes}</p>
                </div>
                <button class="delete-btn" onclick="deleteRecord(${index})" title="删除记录">
                    <span>×</span>
                </button>
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

    function updatePlansDisplay(newPlan = null) {
        const plansList = document.getElementById('plansList');
        if (!plansList) return;
        
        const html = plans.map((plan, index) => `
            <div class="plan-item" style="animation-delay: ${index * 0.1}s">
                <div class="plan-content-wrapper">
                    <h4>计划 ${index + 1}</h4>
                    <p>身高: ${plan.height}cm, 体重: ${plan.weight}kg</p>
                    <div class="plan-content">${plan.plan}</div>
                    <p class="plan-comment">${plan.comment}</p>
                    <small>创建时间: ${new Date(plan.createdAt).toLocaleString()}</small>
                </div>
                <button class="delete-btn" onclick="deletePlan(${index})" title="删除计划">
                    <span>×</span>
                </button>
            </div>
        `).join('');
        
        if (newPlan) {
            // 如果是新计划，添加动画效果
            plansList.style.opacity = '0';
            plansList.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                plansList.innerHTML = html;
                plansList.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                plansList.style.opacity = '1';
                plansList.style.transform = 'translateY(0)';
                
                // 为新计划添加特殊动画
                const newPlanElement = plansList.lastElementChild;
                if (newPlanElement) {
                    newPlanElement.style.background = 'linear-gradient(135deg, rgba(33,150,243,0.1), rgba(33,150,243,0.05))';
                    newPlanElement.style.borderLeftColor = '#2196F3';
                    newPlanElement.style.transform = 'translateX(-20px)';
                    
                    setTimeout(() => {
                        newPlanElement.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        newPlanElement.style.transform = 'translateX(0)';
                    }, 100);
                }
            }, 300);
        } else {
            plansList.innerHTML = html;
        }
    }

    // 删除记录函数
    window.deleteRecord = function(index) {
        if (confirm('确定要删除这条跑步记录吗？')) {
            // 添加删除动画
            const recordItems = document.querySelectorAll('.record-item');
            const targetItem = recordItems[index];
            
            if (targetItem) {
                targetItem.style.transition = 'all 0.3s ease-out';
                targetItem.style.transform = 'translateX(100%)';
                targetItem.style.opacity = '0';
                
                setTimeout(() => {
                    // 从数组中删除记录
                    records.splice(index, 1);
                    // 保存数据
                    saveUserData();
                    // 更新显示
                    updateRecordsDisplay();
                    
                    // 创建删除成功粒子效果
                    const rect = targetItem.getBoundingClientRect();
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => {
                            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
                            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 60;
                            createParticle(x, y);
                        }, i * 25);
                    }
                }, 300);
            }
        }
    };

    // 删除计划函数
    window.deletePlan = function(index) {
        if (confirm('确定要删除这个训练计划吗？')) {
            // 添加删除动画
            const planItems = document.querySelectorAll('.plan-item');
            const targetItem = planItems[index];
            
            if (targetItem) {
                targetItem.style.transition = 'all 0.3s ease-out';
                targetItem.style.transform = 'translateX(100%)';
                targetItem.style.opacity = '0';
                
                setTimeout(() => {
                    // 从数组中删除计划
                    plans.splice(index, 1);
                    // 保存数据
                    saveUserData();
                    // 更新显示
                    updatePlansDisplay();
                    
                    // 创建删除成功粒子效果
                    const rect = targetItem.getBoundingClientRect();
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => {
                            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
                            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 60;
                            createParticle(x, y);
                        }, i * 25);
                    }
                }, 300);
            }
        }
    };

    // Logo点击功能
    const logoModal = document.getElementById('logoModal');
    const confirmModal = document.getElementById('confirmModal');
    const backBtn = document.getElementById('backBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

    // 为sub-nav中的logo添加点击事件（排除更多服务界面）
    const subNavLogo = document.querySelector('.sub-nav .logo-container .logo');
    if (subNavLogo) {
        subNavLogo.addEventListener('click', function() {
            // 检查当前是否在更多服务界面
            const moreModalVisible = moreModal.style.display === 'flex';
            if (!moreModalVisible) {
                // 显示logo点击弹窗
                logoModal.style.display = 'flex';
                logoModal.style.opacity = '0';
                logoModal.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    logoModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    logoModal.style.opacity = '1';
                    logoModal.style.transform = 'scale(1)';
                }, 100);
                
                // 创建点击粒子效果
                const rect = this.getBoundingClientRect();
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 80;
                        const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 80;
                        createParticle(x, y);
                    }, i * 30);
                }
            }
        });
    }

    // 返回按钮点击事件
    backBtn.addEventListener('click', function() {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 关闭logo弹窗
        logoModal.style.transition = 'all 0.3s ease-out';
        logoModal.style.opacity = '0';
        logoModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            logoModal.style.display = 'none';
        }, 300);
    });

    // 注销按钮点击事件
    logoutBtn.addEventListener('click', function() {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 关闭logo弹窗
        logoModal.style.transition = 'all 0.3s ease-out';
        logoModal.style.opacity = '0';
        logoModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            logoModal.style.display = 'none';
            // 显示注销确认弹窗
            confirmModal.style.display = 'flex';
            confirmModal.style.opacity = '0';
            confirmModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                confirmModal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                confirmModal.style.opacity = '1';
                confirmModal.style.transform = 'scale(1)';
            }, 100);
        }, 300);
    });

    // 取消注销按钮点击事件
    cancelLogoutBtn.addEventListener('click', function() {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 关闭确认弹窗
        confirmModal.style.transition = 'all 0.3s ease-out';
        confirmModal.style.opacity = '0';
        confirmModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            confirmModal.style.display = 'none';
        }, 300);
    });

    // 确认注销按钮点击事件
    confirmLogoutBtn.addEventListener('click', function() {
        // 添加按钮点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 创建注销成功粒子效果
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 100;
                const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 100;
                createParticle(x, y);
            }, i * 25);
        }
        
        // 关闭确认弹窗
        confirmModal.style.transition = 'all 0.3s ease-out';
        confirmModal.style.opacity = '0';
        confirmModal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            confirmModal.style.display = 'none';
            
            // 清除当前用户状态
            currentUser = null;
            records = [];
            plans = [];
            
            // 隐藏所有内容模块
            sections.forEach(sec => sec.style.display = 'none');
            moreModal.style.display = 'none';
            
            // 取消按钮高亮
            navButtons.forEach(b => b.classList.remove('active'));
            
            // 隐藏sub-nav
            subNav.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            subNav.style.opacity = '0';
            subNav.style.transform = 'translateY(-30px) scale(0.9)';
            
            setTimeout(() => {
                subNav.style.display = 'none';
                
                // 显示主界面
                cover.style.display = 'block';
                cover.style.opacity = '0';
                cover.style.transform = 'scale(0.8) rotateY(-90deg)';
                
                setTimeout(() => {
                    cover.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    cover.style.opacity = '1';
                    cover.style.transform = 'scale(1) rotateY(0deg)';
                }, 100);
            }, 600);
        }, 300);
    });

    // 点击弹窗背景关闭弹窗
    logoModal.addEventListener('click', function(e) {
        if (e.target === logoModal) {
            logoModal.style.transition = 'all 0.3s ease-out';
            logoModal.style.opacity = '0';
            logoModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                logoModal.style.display = 'none';
            }, 300);
        }
    });

    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            confirmModal.style.transition = 'all 0.3s ease-out';
            confirmModal.style.opacity = '0';
            confirmModal.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                confirmModal.style.display = 'none';
            }, 300);
        }
    });

    // 分析身体类型
    function analyzeBodyType(bmi, height, weight) {
        let category, description;
        
        if (bmi < 18.5) {
            category = '偏瘦';
            description = '您的体重偏轻，需要增加肌肉量和体重。建议结合力量训练和营养补充。';
        } else if (bmi < 24) {
            category = '标准';
            description = '您的体重在健康范围内，身体状况良好。适合进行各种强度的跑步训练。';
        } else if (bmi < 28) {
            category = '超重';
            description = '您的体重略重，需要控制饮食并增加有氧运动来减重。';
        } else {
            category = '肥胖';
            description = '您的体重明显超标，需要在医生指导下进行减重训练。';
        }
        
        return { category, description };
    }

    // 评估体能水平
    function estimateFitnessLevel(bmi, height, weight) {
        // 基于BMI和体重的简单评估
        if (bmi < 18.5 || bmi > 28) {
            return 'beginner';
        } else if (bmi < 20 || bmi > 26) {
            return 'intermediate';
        } else {
            return 'advanced';
        }
    }

    // 生成个性化建议
    function generatePersonalizedTips(height, weight, bmi, bodyType) {
        const tips = [];
        
        // 基于身高的建议
        if (height < 160) {
            tips.push('您的身高较矮，建议选择步频较快的跑步方式，减少步幅');
        } else if (height > 180) {
            tips.push('您的身高较高，注意跑步时的姿势，避免过度弯腰');
        }
        
        // 基于体重的建议
        if (weight < 50) {
            tips.push('体重较轻，注意补充营养，避免过度训练');
        } else if (weight > 80) {
            tips.push('体重较重，建议从快走开始，逐步过渡到跑步');
        }
        
        // 基于BMI的建议
        if (bmi < 18.5) {
            tips.push('建议增加力量训练，提高基础代谢率');
        } else if (bmi > 25) {
            tips.push('建议控制饮食，创造适当的热量缺口');
        }
        
        // 通用建议
        tips.push('保持规律的作息时间，有助于身体恢复');
        tips.push('定期体检，监控身体健康状况');
        
        return tips;
    }

    // 生成详细评价
    function generateDetailedComment(bmi, height, weight, bodyType, fitnessLevel, weightDifference) {
        let comment = `根据您的身体数据分析：`;
        
        if (bmi < 18.5) {
            comment += `您的BMI为${bmi.toFixed(1)}，属于偏瘦体质。`;
            comment += `建议您以增肌为主要目标，结合适量的有氧运动。`;
            comment += `跑步时注意控制强度，避免过度消耗能量。`;
        } else if (bmi < 24) {
            comment += `您的BMI为${bmi.toFixed(1)}，体重在健康范围内。`;
            comment += `您的身体状况良好，可以进行各种类型的跑步训练。`;
            comment += `建议保持当前的运动习惯，逐步提升训练强度。`;
        } else if (bmi < 28) {
            comment += `您的BMI为${bmi.toFixed(1)}，属于轻度超重。`;
            comment += `建议您以减重为主要目标，控制饮食并增加有氧运动。`;
            comment += `跑步时注意保护膝关节，选择合适的跑鞋。`;
        } else {
            comment += `您的BMI为${bmi.toFixed(1)}，属于肥胖范围。`;
            comment += `强烈建议您在医生指导下开始运动计划。`;
            comment += `从低强度的快走开始，逐步过渡到跑步训练。`;
        }
        
        // 添加体能水平评价
        comment += `根据您的身体状况，您的体能水平评估为${fitnessLevel === 'beginner' ? '初级' : fitnessLevel === 'intermediate' ? '中级' : '高级'}。`;
        
        // 添加鼓励性话语
        comment += `坚持运动，循序渐进，您一定能达到理想的健身目标！`;
        
        return comment;
    }
});
