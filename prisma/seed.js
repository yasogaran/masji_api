"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Check if we should skip sample data
// Usage: SKIP_SAMPLE_DATA=true npx prisma db seed
// Or: npm run seed:essential
const SKIP_SAMPLE_DATA = process.env.SKIP_SAMPLE_DATA === 'true';
async function main() {
    if (SKIP_SAMPLE_DATA) {
        console.log('🌱 Starting database seed (ESSENTIAL DATA ONLY - No sample data)...\n');
    }
    else {
        console.log('🌱 Starting database seed (WITH SAMPLE DATA)...\n');
    }
    // ============================================
    // 1. CIVIL STATUS (Lookup Table)
    // ============================================
    console.log('📋 Creating Civil Statuses...');
    const civilStatuses = [
        { title: 'Single' },
        { title: 'Married' },
        { title: 'Divorced' },
        { title: 'Widowed' },
    ];
    for (const status of civilStatuses) {
        await prisma.civilStatus.upsert({
            where: { id: civilStatuses.indexOf(status) + 1 },
            update: { title: status.title },
            create: { title: status.title },
        });
    }
    console.log(`   ✅ Created ${civilStatuses.length} civil statuses`);
    // ============================================
    // 2. EDUCATION LEVELS (Lookup Table)
    // ============================================
    console.log('📋 Creating Education Levels...');
    const educationLevels = [
        { title: 'No Formal Education', sortOrder: 1 },
        { title: 'Primary', sortOrder: 2 },
        { title: 'Secondary (O/L)', sortOrder: 3 },
        { title: 'Higher Secondary (A/L)', sortOrder: 4 },
        { title: 'Diploma', sortOrder: 5 },
        { title: 'Bachelor\'s Degree', sortOrder: 6 },
        { title: 'Master\'s Degree', sortOrder: 7 },
        { title: 'Doctorate (PhD)', sortOrder: 8 },
        { title: 'Islamic Education', sortOrder: 9 },
    ];
    for (let i = 0; i < educationLevels.length; i++) {
        await prisma.educationLevel.upsert({
            where: { id: i + 1 },
            update: { title: educationLevels[i].title, sortOrder: educationLevels[i].sortOrder },
            create: { title: educationLevels[i].title, sortOrder: educationLevels[i].sortOrder },
        });
    }
    console.log(`   ✅ Created ${educationLevels.length} education levels`);
    // ============================================
    // 3. OCCUPATIONS (Lookup Table)
    // ============================================
    console.log('📋 Creating Occupations...');
    const occupations = [
        'Student', 'Teacher', 'Doctor', 'Engineer', 'Businessman',
        'Farmer', 'Driver', 'Laborer', 'Government Employee', 'Private Sector',
        'Self-Employed', 'Retired', 'Housewife', 'Unemployed', 'Overseas Worker',
        'Religious Scholar', 'Other'
    ];
    for (let i = 0; i < occupations.length; i++) {
        await prisma.occupation.upsert({
            where: { id: i + 1 },
            update: { title: occupations[i] },
            create: { title: occupations[i] },
        });
    }
    console.log(`   ✅ Created ${occupations.length} occupations`);
    // ============================================
    // 4. MEMBER STATUSES (Lookup Table)
    // ============================================
    console.log('📋 Creating Member Statuses...');
    const memberStatuses = ['Active', 'Inactive', 'Deceased', 'Relocated', 'Abroad'];
    for (let i = 0; i < memberStatuses.length; i++) {
        await prisma.memberStatus.upsert({
            where: { id: i + 1 },
            update: { title: memberStatuses[i] },
            create: { title: memberStatuses[i] },
        });
    }
    console.log(`   ✅ Created ${memberStatuses.length} member statuses`);
    // ============================================
    // 5. RELATIONSHIP TYPES (Lookup Table)
    // ============================================
    console.log('📋 Creating Relationship Types...');
    const relationshipTypes = [
        { title: 'Family Head', sortOrder: 1 },
        { title: 'Spouse', sortOrder: 2 },
        { title: 'Son', sortOrder: 3 },
        { title: 'Daughter', sortOrder: 4 },
        { title: 'Father', sortOrder: 5 },
        { title: 'Mother', sortOrder: 6 },
        { title: 'Brother', sortOrder: 7 },
        { title: 'Sister', sortOrder: 8 },
        { title: 'Grandfather', sortOrder: 9 },
        { title: 'Grandmother', sortOrder: 10 },
        { title: 'Son-in-law', sortOrder: 11 },
        { title: 'Daughter-in-law', sortOrder: 12 },
        { title: 'Other Relative', sortOrder: 13 },
    ];
    for (let i = 0; i < relationshipTypes.length; i++) {
        await prisma.relationshipType.upsert({
            where: { id: i + 1 },
            update: { title: relationshipTypes[i].title, sortOrder: relationshipTypes[i].sortOrder },
            create: { title: relationshipTypes[i].title, sortOrder: relationshipTypes[i].sortOrder },
        });
    }
    console.log(`   ✅ Created ${relationshipTypes.length} relationship types`);
    // ============================================
    // 6. BOARD ROLES (Lookup Table)
    // ============================================
    console.log('📋 Creating Board Roles...');
    const boardRoles = [
        { roleName: 'President', isMahallaSpecific: false, sortOrder: 1 },
        { roleName: 'Vice President', isMahallaSpecific: false, sortOrder: 2 },
        { roleName: 'Secretary', isMahallaSpecific: false, sortOrder: 3 },
        { roleName: 'Assistant Secretary', isMahallaSpecific: false, sortOrder: 4 },
        { roleName: 'Treasurer', isMahallaSpecific: false, sortOrder: 5 },
        { roleName: 'Assistant Treasurer', isMahallaSpecific: false, sortOrder: 6 },
        { roleName: 'Committee Member', isMahallaSpecific: false, sortOrder: 7 },
        { roleName: 'Area Leader', isMahallaSpecific: true, sortOrder: 8 },
        { roleName: 'Area Secretary', isMahallaSpecific: true, sortOrder: 9 },
    ];
    for (const role of boardRoles) {
        await prisma.boardRole.upsert({
            where: { roleName: role.roleName },
            update: { isMahallaSpecific: role.isMahallaSpecific, sortOrder: role.sortOrder },
            create: role,
        });
    }
    console.log(`   ✅ Created ${boardRoles.length} board roles`);
    // ============================================
    // 7. MOSQUE ROLES (Lookup Table)
    // ============================================
    console.log('📋 Creating Mosque Roles...');
    const mosqueRoles = [
        { roleName: 'Imam', description: 'Prayer leader' },
        { roleName: 'Khatib', description: 'Friday sermon speaker' },
        { roleName: 'Muazzin', description: 'Calls to prayer' },
        { roleName: 'Quran Teacher', description: 'Teaches Quran' },
        { roleName: 'Caretaker', description: 'Mosque maintenance' },
    ];
    for (const role of mosqueRoles) {
        await prisma.mosqueRole.upsert({
            where: { roleName: role.roleName },
            update: { description: role.description },
            create: role,
        });
    }
    console.log(`   ✅ Created ${mosqueRoles.length} mosque roles`);
    // ============================================
    // 8. INCOME CATEGORIES (Lookup Table)
    // ============================================
    console.log('📋 Creating Income Categories...');
    const incomeCategories = [
        'Sandaa Collection',
        'Donation',
        'Rental Income',
        'Event Collection',
        'Interest/Profit',
        'Other Income',
    ];
    for (const cat of incomeCategories) {
        await prisma.incomeCategory.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat },
        });
    }
    console.log(`   ✅ Created ${incomeCategories.length} income categories`);
    // ============================================
    // 9. EXPENSE CATEGORIES (Lookup Table)
    // ============================================
    console.log('📋 Creating Expense Categories...');
    const expenseCategories = [
        'Salaries',
        'Electricity',
        'Water',
        'Maintenance',
        'Events',
        'Charity/Aid',
        'Office Supplies',
        'Transport',
        'Other Expenses',
    ];
    for (const cat of expenseCategories) {
        await prisma.expenseCategory.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat },
        });
    }
    console.log(`   ✅ Created ${expenseCategories.length} expense categories`);
    // ============================================
    // 10. DONATION CATEGORIES (Lookup Table)
    // ============================================
    console.log('📋 Creating Donation Categories...');
    const donationCategories = [
        { name: 'Cash Donation', type: 'money' },
        { name: 'Building Fund', type: 'money' },
        { name: 'Education Fund', type: 'money' },
        { name: 'Jummah Donation', type: 'money' },
        { name: 'Food Items', type: 'goods' },
        { name: 'Clothing', type: 'goods' },
        { name: 'Medical Supplies', type: 'goods' },
        { name: 'Other Goods', type: 'goods' },
    ];
    for (const cat of donationCategories) {
        await prisma.donationCategory.create({
            data: cat,
        }).catch(() => { }); // Ignore if already exists
    }
    console.log(`   ✅ Created ${donationCategories.length} donation categories`);
    // ============================================
    // 11. PERMISSIONS (Lookup Table)
    // ============================================
    console.log('📋 Creating Permissions...');
    const permissions = [
        // People Management
        { code: 'people.read', module: 'people', action: 'read', description: 'View People' },
        { code: 'people.create', module: 'people', action: 'create', description: 'Create People' },
        { code: 'people.update', module: 'people', action: 'update', description: 'Update People' },
        { code: 'people.delete', module: 'people', action: 'delete', description: 'Delete People' },
        // Houses
        { code: 'houses.read', module: 'houses', action: 'read', description: 'View Houses' },
        { code: 'houses.manage', module: 'houses', action: 'manage', description: 'Manage Houses' },
        // Payments
        { code: 'payments.read', module: 'payments', action: 'read', description: 'View Payments' },
        { code: 'payments.record', module: 'payments', action: 'record', description: 'Record Payments' },
        // Zakath
        { code: 'zakath.read', module: 'zakath', action: 'read', description: 'View Zakath' },
        { code: 'zakath.manage', module: 'zakath', action: 'manage', description: 'Manage Zakath' },
        // Finance
        { code: 'finance.read', module: 'finance', action: 'read', description: 'View Finance' },
        { code: 'finance.manage', module: 'finance', action: 'manage', description: 'Manage Finance' },
        // Reports
        { code: 'reports.view', module: 'reports', action: 'view', description: 'View Reports' },
        { code: 'reports.export', module: 'reports', action: 'export', description: 'Export Reports' },
        // Admin
        { code: 'admin.users', module: 'admin', action: 'users', description: 'Manage Users' },
        { code: 'admin.settings', module: 'admin', action: 'settings', description: 'Manage Settings' },
        { code: 'admin.full', module: 'admin', action: 'full', description: 'Full Admin Access' },
    ];
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: { module: perm.module, action: perm.action, description: perm.description },
            create: perm,
        });
    }
    console.log(`   ✅ Created ${permissions.length} permissions`);
    // ============================================
    // 12. TENANT SETTINGS (Key-Value Store)
    // ============================================
    console.log('⚙️ Creating Tenant Settings...');
    const settings = [
        { settingKey: 'mosque_name', settingValue: 'My Mosque' },
        { settingKey: 'mosque_name_ta', settingValue: 'என் பள்ளிவாசல்' },
        { settingKey: 'mosque_name_si', settingValue: 'මගේ පල්ලිය' },
        { settingKey: 'address', settingValue: 'Main Street, City' },
        { settingKey: 'phone', settingValue: '+94 77 000 0000' },
        { settingKey: 'email', settingValue: 'info@mosque.local' },
        { settingKey: 'currency', settingValue: 'LKR' },
        { settingKey: 'timezone', settingValue: 'Asia/Colombo' },
        { settingKey: 'hijri_adjustment', settingValue: '0' },
        { settingKey: 'sandaa_per_person', settingValue: 'false' },
        { settingKey: 'default_sandaa_amount', settingValue: '100.00' },
    ];
    for (const setting of settings) {
        await prisma.tenantSettings.upsert({
            where: { settingKey: setting.settingKey },
            update: { settingValue: setting.settingValue },
            create: setting,
        });
    }
    console.log(`   ✅ Created ${settings.length} tenant settings`);
    // ============================================
    // 13. CREATE MAHALLAS (ESSENTIAL - Always created)
    // ============================================
    console.log('🏘️ Creating Mahallas...');
    const mahallaData = [
        { title: 'Central Area', description: 'Main central area of the mosque community', isOutJamath: false },
        { title: 'North Area', description: 'Northern residential zone', isOutJamath: false },
        { title: 'South Area', description: 'Southern residential zone', isOutJamath: false },
        { title: 'Out Jamath', description: 'Special category for people outside the regular jamath structure. Members here do not require family heads - each person exists independently.', isOutJamath: true },
    ];
    const mahallas = [];
    for (const m of mahallaData) {
        const mahalla = await prisma.mahalla.upsert({
            where: { title: m.title },
            update: { description: m.description, isOutJamath: m.isOutJamath },
            create: { ...m, isActive: true },
        });
        mahallas.push(mahalla);
    }
    console.log(`   ✅ Created ${mahallas.length} mahallas`);
    // Track created family heads (will be empty if skipping sample data)
    let createdFamilyHeads = [];
    // ============================================
    // 14. CREATE HOUSES AND PEOPLE (FAMILIES) - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('🏠 Creating Houses and People (Families)...');
        // Sample names for generating people
        const maleNames = [
            'Mohamed Rizwan', 'Abdul Rahman', 'Faiz Ahmed', 'Imran Khan', 'Yusuf Ali',
            'Hassan Ibrahim', 'Farhan Malik', 'Omar Sharif', 'Bilal Ahmed', 'Salman Khan',
            'Junaid Ahmed', 'Tariq Hassan', 'Wasim Akram', 'Zahir Shah', 'Kamran Ali',
            'Rashid Khan', 'Sajid Mahmood', 'Asif Iqbal', 'Naveed Ahmed', 'Faisal Qureshi',
            'Ahmed Raza', 'Khalid Hussain', 'Mustafa Ali', 'Ibrahim Sheikh', 'Hamza Khan'
        ];
        const femaleNames = [
            'Fatima Begum', 'Ayesha Khan', 'Zainab Ali', 'Khadija Rahman', 'Mariam Bibi',
            'Amina Sultana', 'Ruqaiya Banu', 'Safiya Ahmed', 'Nadia Hussain', 'Sarah Malik',
            'Sana Ahmed', 'Rabia Khatun', 'Hafsa Begum', 'Sumaya Khan', 'Layla Ibrahim',
            'Hira Fatima', 'Aisha Begum', 'Noor Jahan', 'Bushra Khan', 'Razia Sultana'
        ];
        const streetNames = ['Main Street', 'Mosque Road', 'School Lane', 'Market Street', 'Garden Road', 'Temple Road'];
        const cities = ['City Center', 'Town Area', 'Village Side'];
        let totalPeople = 0;
        let totalHouses = 0;
        let totalFamilies = 0;
        const createdFamilyHeads = []; // Store family heads for later use
        // House numbers start from 1 for each mahalla
        for (const mahalla of mahallas) {
            const housesPerMahalla = mahalla.title === 'Central Area' ? 6 : 5;
            for (let h = 0; h < housesPerMahalla; h++) {
                const houseNumber = h + 1; // Reset to 1 for each mahalla
                // Create house
                const house = await prisma.house.upsert({
                    where: {
                        mahallaId_houseNumber: {
                            mahallaId: mahalla.id,
                            houseNumber: houseNumber
                        }
                    },
                    update: {},
                    create: {
                        mahallaId: mahalla.id,
                        houseNumber: houseNumber,
                        addressLine1: `${houseNumber} ${streetNames[h % streetNames.length]}`,
                        city: cities[Math.floor(h / 2) % cities.length],
                        isActive: true,
                    },
                });
                totalHouses++;
                // Some houses have multiple families (houses 1, 3, 5 in each mahalla)
                const familiesInHouse = (houseNumber % 2 === 1) ? 2 : 1;
                for (let f = 0; f < familiesInHouse; f++) {
                    // Create family members (3-5 per family)
                    const familySize = 3 + Math.floor(Math.random() * 3); // 3-5 members
                    let familyHead = null;
                    totalFamilies++;
                    for (let p = 0; p < familySize; p++) {
                        const isMale = p === 0 || (p > 1 && Math.random() > 0.5);
                        const names = isMale ? maleNames : femaleNames;
                        const nameIndex = (totalPeople + p) % names.length;
                        // Relationship: first person is Family Head, second is Spouse, rest are children
                        let relationshipTypeId = 1; // Family Head
                        if (p === 1)
                            relationshipTypeId = 2; // Spouse
                        else if (p > 1)
                            relationshipTypeId = isMale ? 3 : 4; // Son or Daughter
                        const age = p === 0 ? 35 + Math.floor(Math.random() * 20) :
                            p === 1 ? 30 + Math.floor(Math.random() * 15) :
                                5 + Math.floor(Math.random() * 20);
                        const dob = new Date();
                        dob.setFullYear(dob.getFullYear() - age);
                        // NEW SCHEMA: Family heads have familyHeadId = null
                        // Family members have familyHeadId pointing to their family head
                        const person = await prisma.person.create({
                            data: {
                                fullName: names[nameIndex],
                                gender: isMale ? 'male' : 'female',
                                dob: dob,
                                phone: p < 2 ? `077${String(1000000 + totalPeople).slice(-7)}` : null,
                                houseId: house.id,
                                familyHeadId: p > 0 ? familyHead?.id : null, // Family head has null, members point to head
                                relationshipTypeId: relationshipTypeId,
                                memberStatusId: 1, // Active
                                civilStatusId: p < 2 ? 2 : (age > 18 ? 1 : null), // Married for parents, Single for adults
                                educationLevelId: age > 18 ? Math.min(6, Math.floor(Math.random() * 6) + 1) : null,
                                occupationId: age > 18 && p < 2 ? Math.floor(Math.random() * 10) + 1 : (age > 6 ? 1 : null),
                                nic: age > 16 ? `${String(dob.getFullYear()).slice(-2)}${String(totalPeople + 100).padStart(7, '0')}V` : null,
                                bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
                                // Sandaa eligibility fields (only relevant for family heads)
                                isSandaaEligible: p === 0, // Family heads are eligible by default
                                sandaaExemptReason: null,
                            },
                        });
                        if (p === 0) {
                            familyHead = person;
                            createdFamilyHeads.push(person);
                        }
                        totalPeople++;
                    }
                }
            }
        }
        console.log(`   ✅ Created ${totalHouses} houses with ${totalFamilies} families and ${totalPeople} people`);
    } // End of SKIP_SAMPLE_DATA check for section 14
    // ============================================
    // 15. ADMIN USER (ESSENTIAL - Always created)
    // ============================================
    console.log('👤 Creating Admin User...');
    let adminUser = await prisma.user.findUnique({ where: { phone: '0770000000' } });
    if (!adminUser) {
        // Find or create admin person
        let adminPerson = await prisma.person.findFirst({ where: { phone: '0770000000' } });
        if (!adminPerson) {
            // Get or create a house for admin
            let adminHouse = await prisma.house.findFirst();
            // If no house exists (essential mode), create one for admin
            if (!adminHouse) {
                const firstMahalla = mahallas[0];
                adminHouse = await prisma.house.create({
                    data: {
                        mahallaId: firstMahalla.id,
                        houseNumber: 1,
                        addressLine1: 'Admin House',
                        city: 'Main City',
                        isActive: true,
                    },
                });
                console.log('   ✅ Created admin house');
            }
            adminPerson = await prisma.person.create({
                data: {
                    fullName: 'System Administrator',
                    phone: '0770000000',
                    email: 'admin@mosque.local',
                    gender: 'male',
                    houseId: adminHouse.id,
                    memberStatusId: 1,
                    isSandaaEligible: false, // Admin is not a family head for Sandaa purposes
                },
            });
        }
        if (adminPerson) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            adminUser = await prisma.user.create({
                data: {
                    personId: adminPerson.id,
                    phone: '0770000000',
                    passwordHash: hashedPassword,
                    email: 'admin@mosque.local',
                    mustChangePassword: true,
                    status: 'active',
                },
            });
            console.log(`   ✅ Created admin user: ${adminUser.phone}`);
            // Grant all permissions to admin
            const allPermissions = await prisma.permission.findMany();
            for (const perm of allPermissions) {
                await prisma.userPermission.create({
                    data: {
                        userId: adminUser.id,
                        permissionId: perm.id,
                    },
                }).catch(() => { });
            }
            console.log(`   ✅ Granted ${allPermissions.length} permissions to admin`);
        }
    }
    else {
        console.log(`   ⚠️ Admin user already exists`);
    }
    // ============================================
    // 16. CREATE MOSQUE - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('🕌 Creating Mosques...');
        const centralMahalla = mahallas.find(m => m.title === 'Central Area');
        if (centralMahalla) {
            const existingMosque = await prisma.mosque.findFirst({ where: { name: 'Masjid-ul-Huda' } });
            if (!existingMosque) {
                await prisma.mosque.create({
                    data: {
                        name: 'Masjid-ul-Huda',
                        mahallaId: centralMahalla.id,
                        mosqueType: 'parent',
                        addressLine1: '1 Mosque Road',
                        city: 'City Center',
                        phone: '0112345678',
                        isActive: true,
                    },
                });
            }
        }
        // Create sub-mosques
        for (const mahalla of mahallas.filter(m => m.title !== 'Central Area' && !m.isOutJamath)) {
            const mosqueName = `${mahalla.title} Thakya`;
            const existingMosque = await prisma.mosque.findFirst({ where: { name: mosqueName } });
            if (!existingMosque) {
                await prisma.mosque.create({
                    data: {
                        name: mosqueName,
                        mahallaId: mahalla.id,
                        mosqueType: 'sub',
                        addressLine1: `${mahalla.title} Main Road`,
                        isActive: true,
                    },
                });
            }
        }
        console.log(`   ✅ Created 3 mosques`);
    } // End of SKIP_SAMPLE_DATA check for section 16
    // ============================================
    // 17. CREATE BOARD TERM & MEMBERS - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('👥 Creating Board Term & Members...');
        let boardTerm = await prisma.boardTerm.findFirst({ where: { name: '2024-2025' } });
        if (!boardTerm) {
            boardTerm = await prisma.boardTerm.create({
                data: {
                    name: '2024-2025',
                    startDate: new Date('2024-01-01'),
                    endDate: new Date('2025-12-31'),
                    isCurrent: true,
                },
            });
        }
        // Assign some family heads as board members
        const boardRoleRecords = await prisma.boardRole.findMany({ orderBy: { sortOrder: 'asc' } });
        const familyHeadsForBoard = createdFamilyHeads.slice(0, Math.min(boardRoleRecords.length, 6));
        let boardMembersCreated = 0;
        for (let i = 0; i < Math.min(familyHeadsForBoard.length, boardRoleRecords.length); i++) {
            const existingMember = await prisma.boardMember.findFirst({
                where: {
                    boardTermId: boardTerm.id,
                    personId: familyHeadsForBoard[i].id,
                    boardRoleId: boardRoleRecords[i].id,
                },
            });
            if (!existingMember) {
                await prisma.boardMember.create({
                    data: {
                        boardTermId: boardTerm.id,
                        personId: familyHeadsForBoard[i].id,
                        boardRoleId: boardRoleRecords[i].id,
                        startDate: new Date('2024-01-01'),
                    },
                });
                boardMembersCreated++;
            }
        }
        console.log(`   ✅ Created board term with ${boardMembersCreated} members`);
    } // End of SKIP_SAMPLE_DATA check for section 17
    // ============================================
    // 18. CREATE SANDAA CONFIGURATION (ESSENTIAL - Global config)
    // ============================================
    console.log('💰 Creating Sandaa Configuration...');
    // Create a global sandaa config (applies to all mahallas by default) - ESSENTIAL
    const existingSandaaConfig = await prisma.sandaaConfig.findFirst({
        where: { mahallaId: null },
    });
    if (!existingSandaaConfig) {
        await prisma.sandaaConfig.create({
            data: {
                mahallaId: null, // Global config
                amount: 500, // Rs. 500 per month
                frequency: 'monthly',
                whoPays: 'family_head',
                effectiveFrom: new Date('2024-01-01'),
            },
        });
    }
    console.log('   ✅ Created global Sandaa configuration (Rs. 500/month)');
    // Sample: Create a pending config for Central Area - SAMPLE DATA
    if (!SKIP_SAMPLE_DATA) {
        const centralAreaMahalla = await prisma.mahalla.findFirst({
            where: { title: 'Central Area' },
        });
        if (centralAreaMahalla) {
            // Get next month's first day (in UTC to avoid timezone issues)
            const now = new Date();
            const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
            // Check if pending config already exists
            const existingPendingConfig = await prisma.sandaaConfig.findFirst({
                where: {
                    mahallaId: centralAreaMahalla.id,
                    effectiveFrom: { gt: now },
                },
            });
            if (!existingPendingConfig) {
                await prisma.sandaaConfig.create({
                    data: {
                        mahallaId: centralAreaMahalla.id,
                        amount: 600, // Rs. 600 per month - increased rate
                        frequency: 'monthly',
                        whoPays: 'family_head',
                        effectiveFrom: nextMonth, // Takes effect from next month
                    },
                });
                console.log(`   ✅ Created pending Sandaa config for Central Area (Rs. 600/month from ${nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`);
                ;
            }
        }
    } // End of SKIP_SAMPLE_DATA check for pending Sandaa config
    // ============================================
    // 18.5 CREATE A NON-ELIGIBLE FAMILY (ELDER WIDOW) - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('👵 Creating Non-Eligible Family (Elder Widow)...');
        // Get the first mahalla (Central Area)
        const firstMahalla = await prisma.mahalla.findFirst({
            where: { title: 'Central Area' },
        });
        if (firstMahalla) {
            // Get the next available house number in this mahalla
            const lastHouseInMahalla = await prisma.house.findFirst({
                where: { mahallaId: firstMahalla.id },
                orderBy: { houseNumber: 'desc' },
            });
            const nextHouseNumber = (lastHouseInMahalla?.houseNumber || 0) + 1;
            // Create a house for the elder widow
            const widowHouse = await prisma.house.create({
                data: {
                    mahallaId: firstMahalla.id,
                    houseNumber: nextHouseNumber,
                    addressLine1: `${nextHouseNumber} Widow Lane`,
                    city: 'City Center',
                    isActive: true,
                },
            });
            // Create the elder widow person (Family Head, but NOT eligible for Sandaa)
            const elderWidow = await prisma.person.create({
                data: {
                    fullName: 'Fatima Begum',
                    nic: '194512345678',
                    dob: new Date('1945-03-15'), // 80 years old
                    gender: 'female',
                    phone: '0771000099',
                    houseId: widowHouse.id,
                    familyHeadId: null, // She IS the family head
                    memberStatusId: 1, // Active
                    civilStatusId: 4, // Widowed
                    educationLevelId: 1,
                    occupationId: 17, // Retired/Not working
                    bloodGroup: 'O+',
                    notes: 'Elder widow living alone, exempted from Sandaa',
                    relationshipTypeId: 1, // Family Head
                    // NOT eligible for Sandaa
                    isSandaaEligible: false,
                    sandaaExemptReason: 'Elder widow living alone - exempted from Sandaa dues',
                    createdBy: adminUser?.id,
                },
            });
            createdFamilyHeads.push(elderWidow);
            console.log('   ✅ Created non-eligible family: Fatima Begum (Elder Widow)');
        }
        // Generate Sandaa payments for the current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        // Get all eligible family heads (familyHeadId = null AND isSandaaEligible = true)
        const eligibleFamilyHeads = await prisma.person.findMany({
            where: {
                familyHeadId: null, // They are family heads
                isSandaaEligible: true,
            },
        });
        let sandaaPaymentsCreated = 0;
        for (const familyHead of eligibleFamilyHeads) {
            const existingPayment = await prisma.sandaaPayment.findUnique({
                where: {
                    personId_periodMonth_periodYear: {
                        personId: familyHead.id,
                        periodMonth: currentMonth,
                        periodYear: currentYear,
                    },
                },
            });
            if (!existingPayment) {
                // Randomly mark some as paid for demo
                const isPaid = Math.random() > 0.4;
                await prisma.sandaaPayment.create({
                    data: {
                        personId: familyHead.id,
                        periodMonth: currentMonth,
                        periodYear: currentYear,
                        amount: 500,
                        status: isPaid ? 'paid' : 'pending',
                        paidAt: isPaid ? new Date() : null,
                        paidAmount: isPaid ? 500 : null,
                    },
                });
                sandaaPaymentsCreated++;
            }
        }
        console.log(`   ✅ Created ${sandaaPaymentsCreated} Sandaa payments for ${currentMonth}/${currentYear}`);
    } // End of SKIP_SAMPLE_DATA check for section 18.5
    // ============================================
    // 19. CREATE PAYMENT TYPES (ESSENTIAL)
    // ============================================
    console.log('💳 Creating Payment Types...');
    // Create payment types (incoming = income, outgoing = expense) - ESSENTIAL
    const paymentTypeData = [
        { name: 'Building Fund', amount: 1000, description: 'Annual contribution for mosque building maintenance', type: 'incoming' },
        { name: 'Education Fund', amount: 500, description: 'Support for madrasah and educational programs', type: 'incoming' },
        { name: 'Iftar Collection', amount: 200, description: 'Ramadan iftar sponsorship', type: 'incoming' },
        { name: 'Event Contribution', amount: 300, description: 'Special events and celebrations', type: 'incoming' },
        { name: 'Charity Aid', amount: 0, description: 'Voluntary charity contributions', type: 'incoming' },
        { name: 'Infrastructure Fee', amount: 2000, description: 'One-time infrastructure development fee', type: 'incoming' },
        // Outgoing payment types (expenses)
        { name: 'Staff Salary', amount: 0, description: 'Monthly salary for mosque staff', type: 'outgoing' },
        { name: 'Utility Bills', amount: 0, description: 'Electricity, water, and other utilities', type: 'outgoing' },
        { name: 'Maintenance', amount: 0, description: 'Building and equipment maintenance costs', type: 'outgoing' },
    ];
    const createdPaymentTypes = [];
    for (const pt of paymentTypeData) {
        const paymentType = await prisma.paymentType.upsert({
            where: { name: pt.name },
            update: { amount: pt.amount, description: pt.description, type: pt.type },
            create: pt,
        });
        createdPaymentTypes.push(paymentType);
    }
    console.log(`   ✅ Created ${createdPaymentTypes.length} payment types`);
    // Create sample other payments - SAMPLE DATA
    if (!SKIP_SAMPLE_DATA) {
        console.log('💳 Creating Sample Other Payments...');
        const paymentReasons = [
            'Annual contribution',
            'Monthly installment',
            'Voluntary donation',
            'Special occasion',
            'Late payment',
            'Advance payment',
        ];
        let otherPaymentsCreated = 0;
        // Create payments for 2024
        for (let i = 0; i < Math.min(15, createdFamilyHeads.length); i++) {
            const familyHead = createdFamilyHeads[i];
            const randomType = createdPaymentTypes[Math.floor(Math.random() * (createdPaymentTypes.length - 1))];
            const randomReason = paymentReasons[Math.floor(Math.random() * paymentReasons.length)];
            const isPaid = Math.random() > 0.3;
            const paymentDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            await prisma.otherPayment.create({
                data: {
                    personId: familyHead.id,
                    paymentTypeId: randomType.id,
                    amount: randomType.amount || Math.floor(Math.random() * 500) + 100,
                    reason: randomReason,
                    status: isPaid ? 'paid' : 'pending',
                    paidAt: isPaid ? paymentDate : null,
                    createdAt: paymentDate,
                },
            }).catch(() => { });
            otherPaymentsCreated++;
        }
        // Create payments for 2025
        for (let i = 0; i < Math.min(20, createdFamilyHeads.length); i++) {
            const familyHead = createdFamilyHeads[i];
            const randomType = createdPaymentTypes[Math.floor(Math.random() * createdPaymentTypes.length)];
            const randomReason = paymentReasons[Math.floor(Math.random() * paymentReasons.length)];
            const isPaid = Math.random() > 0.4;
            const month = Math.floor(Math.random() * 12);
            const paymentDate = new Date(2025, month, Math.floor(Math.random() * 28) + 1);
            await prisma.otherPayment.create({
                data: {
                    personId: familyHead.id,
                    paymentTypeId: randomType.id,
                    amount: randomType.amount || Math.floor(Math.random() * 500) + 100,
                    reason: randomReason,
                    status: isPaid ? 'paid' : 'pending',
                    paidAt: isPaid ? paymentDate : null,
                    createdAt: paymentDate,
                },
            }).catch(() => { });
            otherPaymentsCreated++;
        }
        // Create payments for 2026 (current year)
        for (let i = 0; i < Math.min(15, createdFamilyHeads.length); i++) {
            const familyHead = createdFamilyHeads[i];
            const randomType = createdPaymentTypes[Math.floor(Math.random() * createdPaymentTypes.length)];
            const randomReason = paymentReasons[Math.floor(Math.random() * paymentReasons.length)];
            const isPaid = Math.random() > 0.5;
            const paymentDate = new Date(2026, 0, Math.floor(Math.random() * 3) + 1);
            await prisma.otherPayment.create({
                data: {
                    personId: familyHead.id,
                    paymentTypeId: randomType.id,
                    amount: randomType.amount || Math.floor(Math.random() * 500) + 100,
                    reason: randomReason,
                    status: isPaid ? 'paid' : 'pending',
                    paidAt: isPaid ? paymentDate : null,
                    createdAt: paymentDate,
                },
            }).catch(() => { });
            otherPaymentsCreated++;
        }
        console.log(`   ✅ Created ${otherPaymentsCreated} other payments`);
    } // End of SKIP_SAMPLE_DATA check for sample payments
    // ============================================
    // 20. CREATE ZAKATH CATEGORIES (ESSENTIAL)
    // ============================================
    console.log('🌙 Creating Zakath Categories...');
    const zakathCategories = [
        {
            name: 'Al-Fuqara (The Poor)',
            nameArabic: 'الفقراء',
            description: 'Those who have insufficient means of livelihood to meet basic needs',
            sortOrder: 1
        },
        {
            name: 'Al-Masakin (The Needy)',
            nameArabic: 'المساكين',
            description: 'Those who have nothing and are in absolute poverty',
            sortOrder: 2
        },
        {
            name: 'Al-Amilina (Zakath Collectors)',
            nameArabic: 'العاملين عليها',
            description: 'Those employed to collect and distribute Zakath',
            sortOrder: 3
        },
        {
            name: 'Al-Muallafatu Qulubuhum (New Muslims)',
            nameArabic: 'المؤلفة قلوبهم',
            description: 'Those whose hearts are to be reconciled, new Muslims needing support',
            sortOrder: 4
        },
        {
            name: 'Ar-Riqab (Freeing Captives)',
            nameArabic: 'في الرقاب',
            description: 'Freeing slaves/captives or helping those in bondage',
            sortOrder: 5
        },
        {
            name: 'Al-Gharimin (Debtors)',
            nameArabic: 'الغارمين',
            description: 'Those in debt who are unable to pay off their debts',
            sortOrder: 6
        },
        {
            name: 'Fi Sabilillah (In the Cause of Allah)',
            nameArabic: 'في سبيل الله',
            description: 'Those striving in the cause of Allah, including students of Islamic knowledge',
            sortOrder: 7
        },
        {
            name: 'Ibn As-Sabil (Travelers)',
            nameArabic: 'ابن السبيل',
            description: 'Stranded travelers who need help to return home',
            sortOrder: 8
        },
    ];
    const createdCategories = [];
    for (const cat of zakathCategories) {
        const category = await prisma.zakathCategory.upsert({
            where: { name: cat.name },
            update: { nameArabic: cat.nameArabic, description: cat.description, sortOrder: cat.sortOrder },
            create: cat,
        });
        createdCategories.push(category);
    }
    console.log(`   ✅ Created ${createdCategories.length} Zakath categories`);
    // ============================================
    // 21. CREATE ZAKATH PERIODS (CYCLES) - SAMPLE DATA
    // ============================================
    let lastYearCycle = null;
    let currentCycle = null;
    if (!SKIP_SAMPLE_DATA) {
        console.log('🌙 Creating Zakath Periods...');
        // Last year's cycle (completed)
        lastYearCycle = await prisma.zakathPeriod.findFirst({ where: { name: 'Ramadan 1445 (2024)' } });
        if (!lastYearCycle) {
            lastYearCycle = await prisma.zakathPeriod.create({
                data: {
                    name: 'Ramadan 1445 (2024)',
                    hijriMonth: 9,
                    hijriYear: 1445,
                    gregorianStart: new Date('2024-03-10'),
                    gregorianEnd: new Date('2024-04-09'),
                    status: 'completed',
                    totalCollected: 250000,
                    totalDistributed: 235000,
                    completedAt: new Date('2024-04-15'),
                    isActive: false,
                },
            });
        }
        // Current year's cycle (active)
        currentCycle = await prisma.zakathPeriod.findFirst({ where: { name: 'Ramadan 1446 (2025)' } });
        if (!currentCycle) {
            currentCycle = await prisma.zakathPeriod.create({
                data: {
                    name: 'Ramadan 1446 (2025)',
                    hijriMonth: 9,
                    hijriYear: 1446,
                    gregorianStart: new Date('2025-02-28'),
                    gregorianEnd: new Date('2025-03-29'),
                    status: 'active',
                    isActive: true,
                },
            });
        }
        console.log(`   ✅ Created 2 Zakath periods (1 completed, 1 active)`);
    } // End of SKIP_SAMPLE_DATA check for Zakath periods
    // ============================================
    // 22. CREATE ZAKATH COLLECTIONS - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA && lastYearCycle && currentCycle) {
        console.log('🌙 Creating Zakath Collections...');
        const donorNames = [
            'Anonymous Donor', 'Mohamed Enterprises', 'Local Business', 'Community Collection',
            'Overseas Donor', 'Corporate Donation'
        ];
        let collectionsCreated = 0;
        const lastYearDonors = createdFamilyHeads.slice(0, 15);
        for (let i = 0; i < lastYearDonors.length; i++) {
            const familyHead = lastYearDonors[i];
            const amount = Math.floor(Math.random() * 15000) + 5000;
            await prisma.zakathCollection.create({
                data: {
                    zakathPeriodId: lastYearCycle.id,
                    donorId: familyHead.id,
                    amount: amount,
                    collectionDate: new Date(2024, 2, 15 + Math.floor(Math.random() * 20)),
                    paymentMethod: ['cash', 'bank_transfer', 'cheque'][Math.floor(Math.random() * 3)],
                    notes: `Zakath contribution for Ramadan 1445`,
                },
            }).catch(() => { });
            collectionsCreated++;
        }
        // Add some anonymous donations
        for (let i = 0; i < 5; i++) {
            await prisma.zakathCollection.create({
                data: {
                    zakathPeriodId: lastYearCycle.id,
                    donorName: donorNames[Math.floor(Math.random() * donorNames.length)],
                    donorPhone: `077${String(8000000 + i).slice(-7)}`,
                    amount: Math.floor(Math.random() * 30000) + 10000,
                    collectionDate: new Date(2024, 2, 20 + i),
                    paymentMethod: ['cash', 'bank_transfer'][Math.floor(Math.random() * 2)],
                    notes: 'External zakath contribution',
                },
            }).catch(() => { });
            collectionsCreated++;
        }
        // Collections for current cycle
        const currentDonors = createdFamilyHeads.slice(0, 10);
        for (let i = 0; i < currentDonors.length; i++) {
            const familyHead = currentDonors[i];
            const amount = Math.floor(Math.random() * 20000) + 5000;
            await prisma.zakathCollection.create({
                data: {
                    zakathPeriodId: currentCycle.id,
                    donorId: familyHead.id,
                    amount: amount,
                    collectionDate: new Date(2025, 2, 1 + Math.floor(Math.random() * 15)),
                    paymentMethod: ['cash', 'bank_transfer'][Math.floor(Math.random() * 2)],
                    notes: `Zakath contribution for Ramadan 1446`,
                },
            }).catch(() => { });
            collectionsCreated++;
        }
        console.log(`   ✅ Created ${collectionsCreated} Zakath collections`);
    } // End of SKIP_SAMPLE_DATA check for Zakath collections
    // ============================================
    // 23. CREATE ZAKATH REQUESTS - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA && lastYearCycle && currentCycle) {
        console.log('🌙 Creating Zakath Requests...');
        const requestReasons = [
            'Medical expenses for chronic illness',
            'Unable to pay house rent due to job loss',
            'Need support for children\'s education',
            'Debt accumulated due to business failure',
            'Medical treatment for family member',
            'Support for daily living expenses',
            'Educational fees for Islamic studies',
            'Travel expenses to return home',
            'Support after natural disaster',
            'Debt repayment assistance',
        ];
        let requestsCreated = 0;
        // Requests for last year's cycle
        const lastYearRequesters = createdFamilyHeads.slice(15, 25);
        for (let i = 0; i < lastYearRequesters.length; i++) {
            const familyHead = lastYearRequesters[i];
            const category = createdCategories[Math.floor(Math.random() * 6)];
            const amountRequested = Math.floor(Math.random() * 20000) + 5000;
            const amountApproved = amountRequested - Math.floor(Math.random() * 3000);
            const request = await prisma.zakathRequest.create({
                data: {
                    zakathPeriodId: lastYearCycle.id,
                    requesterId: familyHead.id,
                    categoryId: category.id,
                    amountRequested: amountRequested,
                    reason: requestReasons[Math.floor(Math.random() * requestReasons.length)],
                    notes: 'Supporting documentation submitted',
                    status: 'distributed',
                    amountApproved: amountApproved,
                    decisionDate: new Date(2024, 2, 25),
                    decisionNotes: 'Approved after verification',
                },
            });
            await prisma.zakathDistribution.create({
                data: {
                    zakathRequestId: request.id,
                    amount: amountApproved,
                    distributedAt: new Date(2024, 3, 1 + Math.floor(Math.random() * 5)),
                    notes: 'Distributed in full',
                },
            });
            requestsCreated++;
        }
        // Requests for current cycle (various statuses)
        const currentRequesters = createdFamilyHeads.slice(10, 20);
        const statuses = ['pending', 'approved', 'distributed', 'partial', 'rejected'];
        for (let i = 0; i < currentRequesters.length; i++) {
            const familyHead = currentRequesters[i];
            const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
            const amountRequested = Math.floor(Math.random() * 25000) + 5000;
            const status = statuses[i % statuses.length];
            const isApproved = ['approved', 'distributed', 'partial'].includes(status);
            const amountApproved = isApproved ? amountRequested - Math.floor(Math.random() * 2000) : null;
            const request = await prisma.zakathRequest.create({
                data: {
                    zakathPeriodId: currentCycle.id,
                    requesterId: familyHead.id,
                    categoryId: category.id,
                    amountRequested: amountRequested,
                    reason: requestReasons[Math.floor(Math.random() * requestReasons.length)],
                    notes: status === 'pending' ? 'Awaiting review' : 'Documents verified',
                    status: status,
                    amountApproved: amountApproved,
                    decisionDate: status !== 'pending' ? new Date(2025, 2, 10 + Math.floor(Math.random() * 10)) : null,
                    decisionNotes: status === 'rejected' ? 'Does not meet eligibility criteria' :
                        status === 'pending' ? null : 'Approved after verification',
                },
            });
            if (status === 'distributed' && amountApproved) {
                await prisma.zakathDistribution.create({
                    data: {
                        zakathRequestId: request.id,
                        amount: amountApproved,
                        distributedAt: new Date(2025, 2, 15 + Math.floor(Math.random() * 5)),
                        notes: 'Distributed in full',
                    },
                });
            }
            else if (status === 'partial' && amountApproved) {
                await prisma.zakathDistribution.create({
                    data: {
                        zakathRequestId: request.id,
                        amount: Math.floor(amountApproved * 0.5),
                        distributedAt: new Date(2025, 2, 15),
                        notes: 'First installment',
                    },
                });
            }
            requestsCreated++;
        }
        console.log(`   ✅ Created ${requestsCreated} Zakath requests with distributions`);
    } // End of SKIP_SAMPLE_DATA check for Zakath requests
    // ============================================
    // KURBAAN SEED DATA - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('\n🐑 Creating Kurbaan Periods and Participants...');
        const QRCode = await Promise.resolve().then(() => __importStar(require('qrcode')));
        const kurbaanPeriods = [
            {
                name: 'Eid ul-Adha 1446',
                hijriYear: 1446,
                gregorianDate: new Date(2025, 5, 7),
                isActive: true,
            },
            {
                name: 'Eid ul-Adha 1445',
                hijriYear: 1445,
                gregorianDate: new Date(2024, 5, 17),
                isActive: false,
            },
        ];
        const createdKurbaanPeriods = [];
        for (const period of kurbaanPeriods) {
            const existing = await prisma.kurbaanPeriod.findFirst({
                where: { name: period.name },
            });
            if (!existing) {
                const created = await prisma.kurbaanPeriod.create({
                    data: period,
                });
                createdKurbaanPeriods.push(created);
            }
            else {
                createdKurbaanPeriods.push(existing);
            }
        }
        console.log(`   ✅ Created ${createdKurbaanPeriods.length} Kurbaan periods`);
        let participantsCreated = 0;
        const generateQRCode = async (data) => {
            try {
                const qrData = JSON.stringify(data);
                return await QRCode.toDataURL(qrData, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#0d9488',
                        light: '#ffffff',
                    },
                });
            }
            catch (error) {
                return '';
            }
        };
        const currentKurbaanPeriod = createdKurbaanPeriods.find(p => p.isActive);
        const lastYearKurbaanPeriod = createdKurbaanPeriods.find(p => !p.isActive);
        if (currentKurbaanPeriod) {
            for (const familyHead of createdFamilyHeads) {
                const familyHeadWithHouse = await prisma.person.findUnique({
                    where: { id: familyHead.id },
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                });
                if (familyHeadWithHouse) {
                    const existingParticipant = await prisma.kurbaanParticipant.findFirst({
                        where: {
                            kurbaanPeriodId: currentKurbaanPeriod.id,
                            familyHeadId: familyHead.id,
                        },
                    });
                    if (!existingParticipant) {
                        const qrData = {
                            type: 'KURBAAN',
                            periodId: currentKurbaanPeriod.id,
                            periodName: currentKurbaanPeriod.name,
                            familyHeadId: familyHead.id,
                            familyHeadName: familyHeadWithHouse.fullName,
                            houseNo: familyHeadWithHouse.house?.houseNumber,
                            mahalla: familyHeadWithHouse.house?.mahalla?.title,
                            timestamp: new Date().toISOString(),
                        };
                        const qrCode = await generateQRCode(qrData);
                        const isDistributed = Math.random() < 0.6;
                        await prisma.kurbaanParticipant.create({
                            data: {
                                kurbaanPeriodId: currentKurbaanPeriod.id,
                                familyHeadId: familyHead.id,
                                qrCode: qrCode,
                                isDistributed: isDistributed,
                                distributedAt: isDistributed ? new Date(2025, 5, 7 + Math.floor(Math.random() * 3)) : null,
                            },
                        });
                        participantsCreated++;
                    }
                }
            }
        }
        if (lastYearKurbaanPeriod) {
            for (const familyHead of createdFamilyHeads) {
                const familyHeadWithHouse = await prisma.person.findUnique({
                    where: { id: familyHead.id },
                    include: {
                        house: {
                            include: { mahalla: true },
                        },
                    },
                });
                if (familyHeadWithHouse) {
                    const existingParticipant = await prisma.kurbaanParticipant.findFirst({
                        where: {
                            kurbaanPeriodId: lastYearKurbaanPeriod.id,
                            familyHeadId: familyHead.id,
                        },
                    });
                    if (!existingParticipant) {
                        const qrData = {
                            type: 'KURBAAN',
                            periodId: lastYearKurbaanPeriod.id,
                            periodName: lastYearKurbaanPeriod.name,
                            familyHeadId: familyHead.id,
                            familyHeadName: familyHeadWithHouse.fullName,
                            houseNo: familyHeadWithHouse.house?.houseNumber,
                            mahalla: familyHeadWithHouse.house?.mahalla?.title,
                            timestamp: new Date().toISOString(),
                        };
                        const qrCode = await generateQRCode(qrData);
                        await prisma.kurbaanParticipant.create({
                            data: {
                                kurbaanPeriodId: lastYearKurbaanPeriod.id,
                                familyHeadId: familyHead.id,
                                qrCode: qrCode,
                                isDistributed: true,
                                distributedAt: new Date(2024, 5, 17 + Math.floor(Math.random() * 3)),
                            },
                        });
                        participantsCreated++;
                    }
                }
            }
        }
        console.log(`   ✅ Created ${participantsCreated} Kurbaan participants`);
    } // End of SKIP_SAMPLE_DATA check for Kurbaan
    // ============================================
    // DONATIONS - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('\n💝 Creating Donations...');
        const currentMonth = new Date().getMonth() + 1; // For use in donations
        const allDonationCategories = await prisma.donationCategory.findMany();
        const moneyCats = allDonationCategories.filter(c => c.type === 'money');
        const goodsCats = allDonationCategories.filter(c => c.type === 'goods');
        let donationsCreated = 0;
        for (let i = 0; i < 15; i++) {
            const familyHead = createdFamilyHeads[i % createdFamilyHeads.length];
            const category = moneyCats[Math.floor(Math.random() * moneyCats.length)];
            const amount = Math.floor(Math.random() * 50000) + 5000;
            const donationDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            await prisma.donation.create({
                data: {
                    donorId: familyHead.id,
                    categoryId: category.id,
                    donationType: 'money',
                    amount: amount,
                    donationDate: donationDate,
                    notes: `Donation for ${category.name}`,
                    createdAt: donationDate,
                },
            }).catch(() => { });
            donationsCreated++;
        }
        for (let i = 0; i < 20; i++) {
            const isExternal = Math.random() > 0.6;
            const familyHead = createdFamilyHeads[i % createdFamilyHeads.length];
            const category = moneyCats[Math.floor(Math.random() * moneyCats.length)];
            const amount = Math.floor(Math.random() * 100000) + 10000;
            const donationDate = new Date(2025, Math.floor(Math.random() * currentMonth), Math.floor(Math.random() * 28) + 1);
            await prisma.donation.create({
                data: {
                    donorId: isExternal ? null : familyHead.id,
                    donorName: isExternal ? ['Mohamed Enterprises', 'Al-Rahma Foundation', 'Overseas Donor Group', 'Anonymous Benefactor', 'Local Business Association'][Math.floor(Math.random() * 5)] : null,
                    donorPhone: isExternal ? `077${String(9000000 + i).slice(-7)}` : null,
                    categoryId: category.id,
                    donationType: 'money',
                    amount: amount,
                    donationDate: donationDate,
                    notes: `Donation for ${category.name} - 2025`,
                    createdAt: donationDate,
                },
            }).catch(() => { });
            donationsCreated++;
        }
        console.log(`   ✅ Created ${donationsCreated} donations`);
    } // End of SKIP_SAMPLE_DATA check for Donations
    // ============================================
    // INVENTORY SEED DATA - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('\n📦 Creating Inventory Items...');
        const inventoryItems = [
            { name: 'Tent (Large)', description: 'Large event tent, 20x40 feet', quantity: 3, location: 'Storage Room A', isRentable: true, rentalPrice: 5000 },
            { name: 'Tent (Medium)', description: 'Medium tent, 10x20 feet', quantity: 5, location: 'Storage Room A', isRentable: true, rentalPrice: 3000 },
            { name: 'Chairs (Plastic)', description: 'White plastic chairs', quantity: 200, location: 'Main Hall Store', isRentable: true, rentalPrice: 25 },
            { name: 'Tables (Folding)', description: 'Folding banquet tables', quantity: 30, location: 'Main Hall Store', isRentable: true, rentalPrice: 200 },
            { name: 'Sound System', description: 'Complete PA system with speakers', quantity: 2, location: 'Control Room', isRentable: true, rentalPrice: 8000 },
            { name: 'Generator (5KVA)', description: 'Portable generator for backup power', quantity: 2, location: 'Utility Room', isRentable: true, rentalPrice: 3500 },
            { name: 'Cooking Pots (Large)', description: 'Large cooking vessels, 50L', quantity: 10, location: 'Kitchen Store', isRentable: true, rentalPrice: 500 },
            { name: 'Projector', description: 'HD projector for presentations', quantity: 1, location: 'Office', isRentable: true, rentalPrice: 2000 },
        ];
        let inventoryCreated = 0;
        const createdInventoryItems = [];
        for (const item of inventoryItems) {
            const existing = await prisma.inventoryItem.findFirst({ where: { name: item.name } });
            if (!existing) {
                const created = await prisma.inventoryItem.create({ data: item });
                createdInventoryItems.push(created);
                inventoryCreated++;
            }
            else {
                createdInventoryItems.push(existing);
            }
        }
        console.log(`   ✅ Created ${inventoryCreated} inventory items`);
        // Create inventory rentals
        console.log('📦 Creating Inventory Rentals...');
        let rentalsCreated = 0;
        const rentableItems = createdInventoryItems.filter(i => i.isRentable);
        for (let i = 0; i < 8; i++) {
            const item = rentableItems[i % rentableItems.length];
            const familyHead = createdFamilyHeads[Math.floor(Math.random() * createdFamilyHeads.length)];
            const isExternal = i % 3 === 0;
            const rentalDate = new Date(2026, 0, Math.floor(Math.random() * 3) + 1);
            const expectedReturn = new Date(rentalDate);
            expectedReturn.setDate(expectedReturn.getDate() + Math.floor(Math.random() * 7) + 1);
            const isReturned = i % 2 === 0;
            const returnDate = isReturned ? new Date(2026, 0, Math.floor(Math.random() * 3) + 3) : null;
            let paymentStatus = null;
            let paymentPaidAt = null;
            if (isReturned) {
                if (i % 4 === 0) {
                    paymentStatus = 'paid';
                    paymentPaidAt = returnDate;
                }
                else if (i % 4 === 2) {
                    paymentStatus = 'waived';
                }
                else {
                    paymentStatus = 'pending';
                }
            }
            try {
                await prisma.inventoryRental.create({
                    data: {
                        inventoryItemId: item.id,
                        rentedTo: isExternal ? null : familyHead.id,
                        rentedToName: isExternal ? 'External Renter' : null,
                        rentalDate: rentalDate,
                        expectedReturn: expectedReturn,
                        returnDate: returnDate,
                        rentalAmount: item.rentalPrice,
                        status: isReturned ? 'returned' : 'active',
                        paymentStatus: paymentStatus,
                        paymentAmount: item.rentalPrice,
                        paymentPaidAt: paymentPaidAt,
                        paymentNotes: paymentStatus === 'paid' ? 'Payment received' : null,
                    },
                });
                rentalsCreated++;
            }
            catch (error) {
                console.error(`Failed to create rental ${i}:`, error.message);
            }
        }
        console.log(`   ✅ Created ${rentalsCreated} inventory rentals`);
    } // End of SKIP_SAMPLE_DATA check for Inventory
    // ============================================
    // PROPERTIES SEED DATA - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('\n🏢 Creating Properties...');
        const properties = [
            { name: 'Shop No. 1', address: '1 Main Street, Commercial Area', description: 'Ground floor shop unit', propertyType: 'Shop' },
            { name: 'Shop No. 2', address: '2 Main Street, Commercial Area', description: 'Ground floor shop unit', propertyType: 'Shop' },
            { name: 'Shop No. 3', address: '3 Main Street, Commercial Area', description: 'Ground floor shop with storage', propertyType: 'Shop' },
            { name: 'Office Space - 1st Floor', address: 'Mosque Building, 1st Floor', description: 'Office space above shops', propertyType: 'Office' },
            { name: 'Parking Lot A', address: 'Behind Mosque', description: 'Open parking area, 20 vehicle capacity', propertyType: 'Land' },
            { name: 'Community Hall', address: 'Adjacent to Main Mosque', description: 'Large hall for events and gatherings', propertyType: 'Commercial' },
        ];
        let propertiesCreated = 0;
        const createdProperties = [];
        for (const prop of properties) {
            const existing = await prisma.property.findFirst({ where: { name: prop.name } });
            if (!existing) {
                const created = await prisma.property.create({ data: prop });
                createdProperties.push(created);
                propertiesCreated++;
            }
            else {
                createdProperties.push(existing);
            }
        }
        console.log(`   ✅ Created ${propertiesCreated} properties`);
        // Create property rentals
        console.log('🏢 Creating Property Rentals...');
        let propertyRentalsCreated = 0;
        const tenants = [
            { name: 'Rashid Textiles', contact: '0771234567' },
            { name: 'Al-Madina Grocery', contact: '0772345678' },
            { name: 'Crescent Electronics', contact: '0773456789' },
            { name: 'IT Solutions Pvt Ltd', contact: '0774567890' },
            { name: 'Mohamed & Sons Parking', contact: '0775678901' },
            { name: 'Event Management Co.', contact: '0776789012' },
        ];
        const monthlyRents = [35000, 40000, 45000, 25000, 15000, 50000];
        for (let i = 0; i < Math.min(createdProperties.length, tenants.length); i++) {
            const property = createdProperties[i];
            const tenant = tenants[i];
            const monthlyRent = monthlyRents[i];
            const startDate = new Date(2024, Math.floor(Math.random() * 6), 1);
            const existingRental = await prisma.propertyRental.findFirst({
                where: { propertyId: property.id, isActive: true },
            });
            if (!existingRental) {
                const rental = await prisma.propertyRental.create({
                    data: {
                        propertyId: property.id,
                        tenantName: tenant.name,
                        tenantContact: tenant.contact,
                        monthlyRent: monthlyRent,
                        startDate: startDate,
                        isActive: true,
                    },
                });
                propertyRentalsCreated++;
                // Create rent payments for 2026
                for (let month = 0; month <= 0; month++) { // January 2026
                    const isPaid = Math.random() > 0.5;
                    await prisma.rentPayment.create({
                        data: {
                            propertyRentalId: rental.id,
                            amount: monthlyRent,
                            periodMonth: month + 1,
                            periodYear: 2026,
                            status: isPaid ? 'paid' : 'pending',
                            paidAt: isPaid ? new Date(2026, month, 5) : null,
                        },
                    }).catch(() => { });
                }
            }
        }
        console.log(`   ✅ Created ${propertyRentalsCreated} property rentals with payments`);
    } // End of SKIP_SAMPLE_DATA check for Properties
    // ============================================
    // ISSUES - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('🔧 Creating Issues...');
        const issueData = [
            {
                title: 'Broken water pipe near Mosque entrance',
                description: 'There is a water leak from the main pipe near the entrance of the mosque.',
                raisedDate: new Date('2024-10-15'),
                status: 'resolved',
                resolution: 'Plumber was called and the pipe was replaced.',
                resolvedDate: new Date('2024-10-18'),
            },
            {
                title: 'Need for additional parking space',
                description: 'During Friday prayers, there is not enough parking space for all attendees.',
                raisedDate: new Date('2024-11-01'),
                status: 'in_progress',
            },
            {
                title: 'Madrasa classroom AC not working',
                description: 'The air conditioner in classroom 2 of the Madrasa has stopped working.',
                raisedDate: new Date('2024-11-20'),
                status: 'open',
            },
        ];
        const raisers = await prisma.person.findMany({ take: 3 });
        for (let i = 0; i < issueData.length; i++) {
            await prisma.issue.create({
                data: {
                    ...issueData[i],
                    raisedBy: raisers[i % raisers.length]?.id,
                },
            });
        }
        console.log(`   ✅ Created ${issueData.length} issues`);
    } // End of SKIP_SAMPLE_DATA check for Issues
    // ============================================
    // MEETINGS - SAMPLE DATA
    // ============================================
    if (!SKIP_SAMPLE_DATA) {
        console.log('📅 Creating Meetings...');
        const meetingsData = [
            {
                title: 'Monthly Board Meeting - October 2024',
                meetingDate: new Date('2024-10-05'),
                meetingTime: new Date('1970-01-01T19:00:00'),
                location: 'Mosque Meeting Hall',
                attendees: 'All board members, Imam, Secretary',
                agenda: '1. Review of monthly finances\n2. Upcoming Eid preparations',
                minutes: 'Meeting started at 7 PM. Discussed financial status - all good.',
            },
            {
                title: 'Monthly Board Meeting - November 2024',
                meetingDate: new Date('2024-11-02'),
                meetingTime: new Date('1970-01-01T19:00:00'),
                location: 'Mosque Meeting Hall',
                attendees: 'All board members except Treasurer (excused), Imam',
                agenda: '1. Eid event review\n2. Winter aid program planning',
                minutes: 'Eid event was successful. Decided to start winter aid distribution.',
            },
        ];
        for (const meeting of meetingsData) {
            await prisma.meeting.create({
                data: meeting,
            });
        }
        console.log(`   ✅ Created ${meetingsData.length} meetings`);
    } // End of SKIP_SAMPLE_DATA check for Meetings
    // ============================================
    // SUMMARY
    // ============================================
    const peopleCounts = await prisma.person.count();
    const familyHeadCounts = await prisma.person.count({ where: { familyHeadId: null } });
    const housesCounts = await prisma.house.count();
    const mosqueCounts = await prisma.mosque.count();
    const sandaaPaymentsCounts = await prisma.sandaaPayment.count();
    console.log('\n========================================');
    if (SKIP_SAMPLE_DATA) {
        console.log('🎉 Database seeding completed (ESSENTIAL DATA ONLY)!');
    }
    else {
        console.log('🎉 Database seeding completed successfully!');
    }
    console.log('========================================\n');
    console.log('📊 Summary:');
    console.log(`   • Mahallas: ${mahallas.length}`);
    console.log(`   • Houses: ${housesCounts}`);
    console.log(`   • People: ${peopleCounts}`);
    console.log(`   • Families (Family Heads): ${familyHeadCounts}`);
    console.log(`   • Mosques: ${mosqueCounts}`);
    console.log(`   • Sandaa Payments: ${sandaaPaymentsCounts}`);
    console.log(`   • Admin User: 1`);
    console.log('\n🔐 Default Admin Login:');
    console.log('   Phone: 0770000000');
    console.log('   Password: admin123');
    console.log('   (Password change required on first login)');
    if (SKIP_SAMPLE_DATA) {
        console.log('\n📝 Note: Sample data was skipped. Only essential configuration data was created.');
        console.log('   This includes: Categories, Payment Types, Mahallas, Admin User, and Settings.');
    }
    console.log('');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
