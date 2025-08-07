// Always-Available WhatsApp-like Chat Application - ENHANCED
class AlwaysAvailableChatApp {
    constructor() {
        this.FORCE_ENABLED = true;
        this.currentUser = null;
        this.currentChat = null;
        this.users = [];
        this.groups = [];
        this.messages = [];
        this.companySettings = {
            name: "TechCorp Inc.",
            logo: null,
            description: "Always-Available Enterprise Chat",
            isDisabled: false,
            disableUntil: null
        };
        
        this.emergencyInit();
    }

    emergencyInit() {
        console.log('🚀 Starting enhanced initialization...');
        
        this.forceHideAllModals();
        this.forceHideDisabledScreen();
        this.forceShowLoginScreen();
        this.clearProblematicStorage();
        this.safeInit();
    }

    // ... [Previous emergency methods remain the same] ...

    loadData() {
        // Enhanced default users with proper roles
        this.users = [
            {id: 1, name: "System Admin", phone: "admin", role: "admin", status: "online", avatar: "👨‍💼", password: "superadmin123!", lastSeen: new Date().toISOString()},
            {id: 2, name: "Sarah Manager", phone: "+1234567891", role: "user", status: "online", avatar: "👩‍💼", lastSeen: new Date().toISOString()},
            {id: 3, name: "Mike Developer", phone: "+1234567892", role: "user", status: "away", avatar: "👨‍💻", lastSeen: new Date().toISOString()},
            {id: 4, name: "Lisa Designer", phone: "+1234567893", role: "user", status: "online", avatar: "👩‍🎨", lastSeen: new Date().toISOString()},
            {id: 5, name: "Tom Support", phone: "+1234567894", role: "user", status: "offline", avatar: "👨‍🔧", lastSeen: new Date(Date.now() - 3600000).toISOString()}
        ];

        // Load from storage with fallback
        try {
            const savedUsers = localStorage.getItem('chatApp_users');
            if (savedUsers) this.users = JSON.parse(savedUsers);
            
            const savedSettings = localStorage.getItem('chatApp_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.companySettings = { ...this.companySettings, ...settings };
            }
        } catch (e) {
            console.warn('Using default data');
        }

        // Default messages
        this.messages = [
            {id: 1, senderId: 2, receiverId: 1, content: "Good morning! Ready for today's demo? 🌟", timestamp: new Date(Date.now() - 300000).toISOString(), type: "text"},
            {id: 2, senderId: 1, receiverId: 2, content: "Absolutely! The new features are looking great 👍 @Sarah Manager", timestamp: new Date(Date.now() - 240000).toISOString(), type: "text"},
            {id: 3, senderId: 3, receiverId: 1, content: "Latest build is ready for testing @System Admin", timestamp: new Date(Date.now() - 180000).toISOString(), type: "text"},
            {id: 4, senderId: 4, groupId: 1, content: "Updated the design assets in the shared folder 🎨", timestamp: new Date(Date.now() - 120000).toISOString(), type: "text"},
            {id: 5, senderId: 1, groupId: 1, content: "Excellent work everyone! This release is going to be amazing 🚀", timestamp: new Date(Date.now() - 60000).toISOString(), type: "text"}
        ];

        try {
            const savedMessages = localStorage.getItem('chatApp_messages');
            if (savedMessages) this.messages = JSON.parse(savedMessages);
        } catch (e) {
            console.warn('Using default messages');
        }

        // Default groups
        this.groups = [
            {id: 1, name: "Development Team", members: [1, 3, 4], admin: 1, avatar: "👥", description: "Main development team discussions"},
            {id: 2, name: "Management", members: [1, 2], admin: 1, avatar: "🏢", description: "Management coordination"}
        ];

        try {
            const savedGroups = localStorage.getItem('chatApp_groups');
            if (savedGroups) this.groups = JSON.parse(savedGroups);
        } catch (e) {
            console.warn('Using default groups');
        }
    }

    setupEventListeners() {
        // Enhanced login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // ... [Previous event listeners remain the same] ...

        // Admin disable app functionality
        const disableAppBtn = document.getElementById('disableAppBtn');
        if (disableAppBtn) {
            disableAppBtn.addEventListener('click', () => this.showDisableAppModal());
        }

        // Enable app functionality
        const enableAppBtn = document.getElementById('enableAppBtn');
        if (enableAppBtn) {
            enableAppBtn.addEventListener('click', () => this.enableApp());
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!username || !password) {
            this.showError('Please enter username and password');
            return;
        }

        // Check if app is disabled
        if (this.companySettings.isDisabled && new Date() < new Date(this.companySettings.disableUntil)) {
            this.showError(`App is disabled until ${new Date(this.companySettings.disableUntil).toLocaleString()}`);
            return;
        }

        // Reset disable if time has passed
        if (this.companySettings.disableUntil && new Date() > new Date(this.companySettings.disableUntil)) {
            this.companySettings.isDisabled = false;
            this.companySettings.disableUntil = null;
            this.saveData();
        }

        const user = this.users.find(u => 
            (u.phone === username || u.name.toLowerCase() === username.toLowerCase()) && 
            (u.password === password || (username === 'admin' && password === 'superadmin123!'))
        );

        if (user) {
            this.currentUser = user;
            console.log('✅ Login successful, transitioning to chat app...');
            this.transitionToChatApp();
            
            user.status = 'online';
            user.lastSeen = new Date().toISOString();
            this.saveData();
        } else {
            this.showError('Invalid credentials. Try admin/superadmin123!');
        }
    }

    showDisableAppModal() {
        if (this.currentUser.role !== 'admin') {
            this.showNotification('Access Denied', 'Only admins can disable the app', 'error');
            return;
        }

        const modal = document.getElementById('disableAppModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    disableApp() {
        const hours = parseInt(document.getElementById('disableHours').value) || 1;
        const reason = document.getElementById('disableReason').value || 'Maintenance';
        
        if (!confirm(`Are you sure you want to disable the app for ${hours} hour(s)?\nReason: ${reason}`)) {
            return;
        }

        const disableUntil = new Date(Date.now() + (hours * 60 * 60 * 1000));
        
        this.companySettings.isDisabled = true;
        this.companySettings.disableUntil = disableUntil.toISOString();
        this.companySettings.disableReason = reason;
        
        this.saveData();
        this.hideModal('disableAppModal');
        
        this.showNotification('App Disabled', `App will be disabled until ${disableUntil.toLocaleString()}`, 'warning');
        
        // Force logout all users
        this.logout();
    }

    enableApp() {
        if (this.currentUser.role !== 'admin') {
            this.showNotification('Access Denied', 'Only admins can enable the app', 'error');
            return;
        }

        this.companySettings.isDisabled = false;
        this.companySettings.disableUntil = null;
        this.companySettings.disableReason = null;
        
        this.saveData();
        this.showNotification('App Enabled', 'Application has been re-enabled', 'success');
    }

    // Admin message deletion
    deleteMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        if (message.senderId !== this.currentUser.id && this.currentUser.role !== 'admin') {
            this.showNotification('Access Denied', 'You can only delete your own messages', 'error');
            return;
        }

        if (!confirm('Delete this message?')) return;

        this.messages = this.messages.filter(m => m.id !== messageId);
        this.saveData();
        this.renderMessages();
        this.renderContactList();
        this.showNotification('Message deleted', 'Message removed successfully', 'success');
    }

    // Enhanced user management
    addUser() {
        const name = document.getElementById('newUserName').value.trim();
        const phone = document.getElementById('newUserPhone').value.trim();
        const password = document.getElementById('newUserPassword').value.trim();
        const role = document.getElementById('newUserRole').value;
        const avatar = document.getElementById('newUserAvatar').value.trim() || '👤';

        if (!name || !phone || !password) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (this.users.find(u => u.phone === phone || u.name.toLowerCase() === name.toLowerCase())) {
            this.showError('Phone number or username already exists');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            phone,
            password,
            role,
            status: 'offline',
            avatar,
            lastSeen: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveData();
        this.renderUserManagement();
        this.renderContactList();
        this.hideModal('addUserModal');
        this.showNotification('User added ✅', `${name} has been added`, 'success');

        // Clear form
        ['newUserName', 'newUserPhone', 'newUserPassword', 'newUserAvatar'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('newUserRole').value = 'user';
    }

    // Enhanced logo upload with dimension validation
    handleLogoUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 170 || img.height < 66) {
                    this.showError(`Logo must be at least 170x66 pixels. Your image: ${img.width}x${img.height}`);
                    return;
                }
                
                this.companySettings.logo = e.target.result;
                this.saveData();
                this.updateCompanyBranding();
                this.showNotification('Logo updated', 'Company logo updated successfully', 'success');
            };
            img.onerror = () => {
                this.showError('Invalid image file');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Enhanced settings with company details
    saveSettings() {
        if (this.currentUser.role === 'admin') {
            const companyNameInput = document.getElementById('companyNameInput');
            const companyDescriptionInput = document.getElementById('companyDescriptionInput');
            
            if (companyNameInput) {
                this.companySettings.name = companyNameInput.value.trim() || this.companySettings.name;
            }
            if (companyDescriptionInput) {
                this.companySettings.description = companyDescriptionInput.value.trim() || this.companySettings.description;
            }
        }

        this.saveData();
        this.updateCompanyBranding();
        this.hideModal('settingsModal');
        this.showNotification('Settings saved ✅', 'Your settings have been updated', 'success');
    }

    // ... [Rest of the methods remain the same] ...

    // Enhanced save data with company settings
    saveData() {
        try {
            localStorage.setItem('chatApp_users', JSON.stringify(this.users));
            localStorage.setItem('chatApp_messages', JSON.stringify(this.messages));
            localStorage.setItem('chatApp_groups', JSON.stringify(this.groups));
            
            const safeSettings = {
                name: this.companySettings.name,
                logo: this.companySettings.logo,
                description: this.companySettings.description,
                isDisabled: this.companySettings.isDisabled,
                disableUntil: this.companySettings.disableUntil,
                disableReason: this.companySettings.disableReason
            };
            localStorage.setItem('chatApp_settings', JSON.stringify(safeSettings));
        } catch (e) {
            console.warn('Error saving data:', e);
        }
    }
}

// ... [Global functions remain the same] ...
