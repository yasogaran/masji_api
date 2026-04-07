-- CreateTable
CREATE TABLE `tenant_settings` (
    `id` VARCHAR(191) NOT NULL,
    `setting_key` VARCHAR(191) NOT NULL,
    `setting_value` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenant_settings_setting_key_key`(`setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_statuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `civil_statuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education_levels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `occupations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relationship_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahallas` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_out_jamath` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,

    UNIQUE INDEX `mahallas_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `houses` (
    `id` VARCHAR(191) NOT NULL,
    `mahalla_id` VARCHAR(191) NOT NULL,
    `house_number` INTEGER NOT NULL,
    `address_line_1` VARCHAR(100) NULL,
    `address_line_2` VARCHAR(100) NULL,
    `address_line_3` VARCHAR(100) NULL,
    `city` VARCHAR(50) NULL,
    `postal_code` VARCHAR(10) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,

    UNIQUE INDEX `houses_mahalla_id_house_number_key`(`mahalla_id`, `house_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mosques` (
    `id` VARCHAR(191) NOT NULL,
    `mahalla_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `mosque_type` VARCHAR(20) NOT NULL DEFAULT 'sub',
    `address_line_1` VARCHAR(100) NULL,
    `address_line_2` VARCHAR(100) NULL,
    `city` VARCHAR(50) NULL,
    `phone` VARCHAR(20) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `people` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `nic` VARCHAR(20) NULL,
    `dob` DATE NULL,
    `gender` VARCHAR(10) NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `house_id` VARCHAR(191) NOT NULL,
    `family_head_id` VARCHAR(191) NULL,
    `relationship_type_id` INTEGER NULL,
    `member_status_id` INTEGER NULL DEFAULT 1,
    `civil_status_id` INTEGER NULL,
    `date_of_death` DATE NULL,
    `education_level_id` INTEGER NULL,
    `occupation_id` INTEGER NULL,
    `blood_group` VARCHAR(5) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `is_family_head` BOOLEAN NOT NULL DEFAULT false,
    `family_name` VARCHAR(100) NULL,
    `is_sandaa_eligible` BOOLEAN NOT NULL DEFAULT true,
    `sandaa_exempt_reason` VARCHAR(200) NULL,

    UNIQUE INDEX `people_nic_key`(`nic`),
    INDEX `people_family_head_id_idx`(`family_head_id`),
    INDEX `people_house_id_idx`(`house_id`),
    INDEX `people_full_name_idx`(`full_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sandaa_configs` (
    `id` VARCHAR(191) NOT NULL,
    `mahalla_id` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `frequency` VARCHAR(10) NULL,
    `who_pays` VARCHAR(20) NULL,
    `effective_from` DATE NOT NULL,
    `effective_to` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sandaa_payments` (
    `id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `period_month` INTEGER NOT NULL,
    `period_year` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'pending',
    `paid_at` DATETIME(3) NULL,
    `paid_amount` DECIMAL(10, 2) NULL,
    `received_by` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sandaa_payments_status_period_year_period_month_idx`(`status`, `period_year`, `period_month`),
    UNIQUE INDEX `sandaa_payments_person_id_period_month_period_year_key`(`person_id`, `period_month`, `period_year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_types` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `type` VARCHAR(20) NOT NULL DEFAULT 'incoming',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payment_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `other_payments` (
    `id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `payment_type_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `reason` TEXT NULL,
    `status` VARCHAR(10) NOT NULL DEFAULT 'pending',
    `paid_at` DATETIME(3) NULL,
    `received_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zakath_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `name_arabic` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `zakath_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zakath_periods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `hijri_month` INTEGER NULL,
    `hijri_year` INTEGER NOT NULL,
    `gregorian_start` DATE NULL,
    `gregorian_end` DATE NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `total_collected` DECIMAL(12, 2) NULL,
    `total_distributed` DECIMAL(12, 2) NULL,
    `completed_at` DATETIME(3) NULL,
    `completed_by` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zakath_collections` (
    `id` VARCHAR(191) NOT NULL,
    `zakath_period_id` VARCHAR(191) NOT NULL,
    `donor_id` VARCHAR(191) NULL,
    `donor_name` VARCHAR(100) NULL,
    `donor_phone` VARCHAR(20) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `collection_date` DATE NOT NULL,
    `payment_method` VARCHAR(20) NULL,
    `reference_no` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    INDEX `zakath_collections_zakath_period_id_idx`(`zakath_period_id`),
    INDEX `zakath_collections_collection_date_idx`(`collection_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zakath_requests` (
    `id` VARCHAR(191) NOT NULL,
    `zakath_period_id` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `amount_requested` DECIMAL(12, 2) NOT NULL,
    `reason` TEXT NOT NULL,
    `notes` TEXT NULL,
    `supporting_docs` TEXT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `amount_approved` DECIMAL(12, 2) NULL,
    `decision_date` DATE NULL,
    `decision_notes` TEXT NULL,
    `decided_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_external` BOOLEAN NOT NULL DEFAULT false,
    `external_name` VARCHAR(200) NULL,
    `external_phone` VARCHAR(20) NULL,
    `external_nic` VARCHAR(20) NULL,
    `external_address` TEXT NULL,

    INDEX `zakath_requests_zakath_period_id_idx`(`zakath_period_id`),
    INDEX `zakath_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zakath_distributions` (
    `id` VARCHAR(191) NOT NULL,
    `zakath_request_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `distributed_at` DATETIME(3) NOT NULL,
    `distributed_by` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `zakath_distributions_zakath_request_id_idx`(`zakath_request_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kurbaan_periods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `hijri_year` INTEGER NOT NULL,
    `gregorian_date` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kurbaan_participants` (
    `id` VARCHAR(191) NOT NULL,
    `kurbaan_period_id` VARCHAR(191) NOT NULL,
    `family_head_id` VARCHAR(191) NULL,
    `qr_code` TEXT NOT NULL,
    `is_distributed` BOOLEAN NOT NULL DEFAULT false,
    `distributed_at` DATETIME(3) NULL,
    `distributed_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_external` BOOLEAN NOT NULL DEFAULT false,
    `external_name` VARCHAR(200) NULL,
    `external_phone` VARCHAR(20) NULL,
    `external_address` TEXT NULL,
    `external_people_count` INTEGER NULL,

    UNIQUE INDEX `kurbaan_participants_kurbaan_period_id_family_head_id_key`(`kurbaan_period_id`, `family_head_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donations` (
    `id` VARCHAR(191) NOT NULL,
    `donor_id` VARCHAR(191) NULL,
    `donor_name` VARCHAR(100) NULL,
    `donor_phone` VARCHAR(20) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `donation_type` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(12, 2) NULL,
    `item_description` TEXT NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(20) NULL,
    `estimated_value` DECIMAL(12, 2) NULL,
    `donation_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `is_carry_forward` BOOLEAN NOT NULL DEFAULT false,
    `carry_from_year` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    INDEX `donations_donation_date_idx`(`donation_date`),
    INDEX `donations_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_distributions` (
    `id` VARCHAR(191) NOT NULL,
    `recipient_id` VARCHAR(191) NULL,
    `recipient_name` VARCHAR(100) NULL,
    `recipient_phone` VARCHAR(20) NULL,
    `recipient_address` TEXT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `distribution_type` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(12, 2) NULL,
    `item_description` TEXT NULL,
    `quantity` INTEGER NULL,
    `unit` VARCHAR(20) NULL,
    `reason` TEXT NULL,
    `distribution_date` DATE NOT NULL,
    `notes` TEXT NULL,
    `approved_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    INDEX `donation_distributions_distribution_date_idx`(`distribution_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `income_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `income_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incomes` (
    `id` VARCHAR(191) NOT NULL,
    `receipt_number` VARCHAR(50) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `source_type` VARCHAR(20) NULL,
    `payer_id` VARCHAR(191) NULL,
    `payer_name` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `transaction_date` DATE NOT NULL,
    `payment_method` VARCHAR(20) NULL DEFAULT 'cash',
    `reference_no` VARCHAR(50) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    INDEX `incomes_transaction_date_idx`(`transaction_date`),
    INDEX `incomes_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `expense_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` VARCHAR(191) NOT NULL,
    `voucher_number` VARCHAR(50) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `payee_type` VARCHAR(20) NULL,
    `payee_id` VARCHAR(191) NULL,
    `payee_name` VARCHAR(100) NULL,
    `description` TEXT NOT NULL,
    `transaction_date` DATE NOT NULL,
    `payment_method` VARCHAR(20) NULL DEFAULT 'cash',
    `reference_no` VARCHAR(50) NULL,
    `approved_by` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    INDEX `expenses_transaction_date_idx`(`transaction_date`),
    INDEX `expenses_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salaries` (
    `id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `period_month` INTEGER NOT NULL,
    `period_year` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `paid_at` DATETIME(3) NULL,
    `payment_method` VARCHAR(20) NULL,
    `expense_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    UNIQUE INDEX `salaries_person_id_period_month_period_year_key`(`person_id`, `period_month`, `period_year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `location` VARCHAR(100) NULL,
    `is_rentable` BOOLEAN NOT NULL DEFAULT false,
    `rental_price` DECIMAL(10, 2) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `inventory_item_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `previous_qty` INTEGER NOT NULL,
    `new_qty` INTEGER NOT NULL,
    `reason` VARCHAR(50) NOT NULL,
    `notes` TEXT NULL,
    `created_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_rentals` (
    `id` VARCHAR(191) NOT NULL,
    `inventory_item_id` VARCHAR(191) NOT NULL,
    `rented_to` VARCHAR(191) NULL,
    `rented_to_name` VARCHAR(100) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `rental_date` DATE NOT NULL,
    `return_date` DATE NULL,
    `expected_return` DATE NULL,
    `rental_amount` DECIMAL(10, 2) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `payment_amount` DECIMAL(10, 2) NULL,
    `payment_status` VARCHAR(20) NULL,
    `payment_paid_at` DATETIME(3) NULL,
    `payment_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `properties` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NULL,
    `description` TEXT NULL,
    `property_type` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_rentals` (
    `id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `tenant_name` VARCHAR(100) NOT NULL,
    `tenant_contact` VARCHAR(50) NULL,
    `monthly_rent` DECIMAL(10, 2) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rent_payments` (
    `id` VARCHAR(191) NOT NULL,
    `property_rental_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `period_month` INTEGER NOT NULL,
    `period_year` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `paid_at` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `rent_payments_status_idx`(`status`),
    UNIQUE INDEX `rent_payments_property_rental_id_period_month_period_year_key`(`property_rental_id`, `period_month`, `period_year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_roles` (
    `id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(50) NOT NULL,
    `is_mahalla_specific` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `board_roles_role_name_key`(`role_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_terms` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `term_years` INTEGER NOT NULL DEFAULT 2,
    `is_current` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_members` (
    `id` VARCHAR(191) NOT NULL,
    `board_term_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `board_role_id` VARCHAR(191) NOT NULL,
    `mahalla_id` VARCHAR(191) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `board_members_board_term_id_idx`(`board_term_id`),
    INDEX `board_members_person_id_idx`(`person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mosque_roles` (
    `id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `mosque_roles_role_name_key`(`role_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mosque_role_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `mosque_id` VARCHAR(191) NOT NULL,
    `mosque_role_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assigned_by` VARCHAR(191) NULL,

    INDEX `mosque_role_assignments_mosque_id_idx`(`mosque_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `issues` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `raised_by` VARCHAR(191) NULL,
    `raised_date` DATE NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'open',
    `resolution` TEXT NULL,
    `resolved_date` DATE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meetings` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NULL,
    `meeting_date` DATE NOT NULL,
    `meeting_time` TIME(0) NULL,
    `location` VARCHAR(100) NULL,
    `attendees` TEXT NULL,
    `agenda` TEXT NULL,
    `minutes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meeting_decisions` (
    `id` VARCHAR(191) NOT NULL,
    `meeting_id` VARCHAR(191) NOT NULL,
    `decision` TEXT NOT NULL,
    `related_issue_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `publish_date` DATE NOT NULL,
    `expiry_date` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NULL,
    `must_change_password` BOOLEAN NOT NULL DEFAULT true,
    `password_changed_at` DATETIME(3) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `failed_attempts` INTEGER NOT NULL DEFAULT 0,
    `locked_until` DATETIME(3) NULL,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_person_id_key`(`person_id`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `module` VARCHAR(50) NOT NULL,
    `action` VARCHAR(20) NOT NULL,
    `description` VARCHAR(200) NULL,

    UNIQUE INDEX `permissions_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_permissions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `permission_id` INTEGER NOT NULL,
    `mahalla_id` VARCHAR(191) NULL,
    `granted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `granted_by` VARCHAR(191) NULL,

    UNIQUE INDEX `user_permissions_user_id_permission_id_mahalla_id_key`(`user_id`, `permission_id`, `mahalla_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_requests` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `reset_type` VARCHAR(20) NOT NULL,
    `otp_code` VARCHAR(6) NULL,
    `otp_expires_at` DATETIME(3) NULL,
    `reset_by` VARCHAR(191) NULL,
    `temp_password` VARCHAR(255) NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `action` VARCHAR(50) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `old_values` JSON NULL,
    `new_values` JSON NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    INDEX `audit_logs_user_id_idx`(`user_id`),
    INDEX `audit_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `houses` ADD CONSTRAINT `houses_mahalla_id_fkey` FOREIGN KEY (`mahalla_id`) REFERENCES `mahallas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mosques` ADD CONSTRAINT `mosques_mahalla_id_fkey` FOREIGN KEY (`mahalla_id`) REFERENCES `mahallas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_house_id_fkey` FOREIGN KEY (`house_id`) REFERENCES `houses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_family_head_id_fkey` FOREIGN KEY (`family_head_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_relationship_type_id_fkey` FOREIGN KEY (`relationship_type_id`) REFERENCES `relationship_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_member_status_id_fkey` FOREIGN KEY (`member_status_id`) REFERENCES `member_statuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_civil_status_id_fkey` FOREIGN KEY (`civil_status_id`) REFERENCES `civil_statuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_education_level_id_fkey` FOREIGN KEY (`education_level_id`) REFERENCES `education_levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `people` ADD CONSTRAINT `people_occupation_id_fkey` FOREIGN KEY (`occupation_id`) REFERENCES `occupations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sandaa_configs` ADD CONSTRAINT `sandaa_configs_mahalla_id_fkey` FOREIGN KEY (`mahalla_id`) REFERENCES `mahallas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sandaa_payments` ADD CONSTRAINT `sandaa_payments_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sandaa_payments` ADD CONSTRAINT `sandaa_payments_received_by_fkey` FOREIGN KEY (`received_by`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_payments` ADD CONSTRAINT `other_payments_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_payments` ADD CONSTRAINT `other_payments_payment_type_id_fkey` FOREIGN KEY (`payment_type_id`) REFERENCES `payment_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_payments` ADD CONSTRAINT `other_payments_received_by_fkey` FOREIGN KEY (`received_by`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_collections` ADD CONSTRAINT `zakath_collections_zakath_period_id_fkey` FOREIGN KEY (`zakath_period_id`) REFERENCES `zakath_periods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_collections` ADD CONSTRAINT `zakath_collections_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_requests` ADD CONSTRAINT `zakath_requests_zakath_period_id_fkey` FOREIGN KEY (`zakath_period_id`) REFERENCES `zakath_periods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_requests` ADD CONSTRAINT `zakath_requests_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_requests` ADD CONSTRAINT `zakath_requests_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `zakath_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_distributions` ADD CONSTRAINT `zakath_distributions_zakath_request_id_fkey` FOREIGN KEY (`zakath_request_id`) REFERENCES `zakath_requests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zakath_distributions` ADD CONSTRAINT `zakath_distributions_distributed_by_fkey` FOREIGN KEY (`distributed_by`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kurbaan_participants` ADD CONSTRAINT `kurbaan_participants_kurbaan_period_id_fkey` FOREIGN KEY (`kurbaan_period_id`) REFERENCES `kurbaan_periods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kurbaan_participants` ADD CONSTRAINT `kurbaan_participants_family_head_id_fkey` FOREIGN KEY (`family_head_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kurbaan_participants` ADD CONSTRAINT `kurbaan_participants_distributed_by_fkey` FOREIGN KEY (`distributed_by`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `donation_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_distributions` ADD CONSTRAINT `donation_distributions_recipient_id_fkey` FOREIGN KEY (`recipient_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation_distributions` ADD CONSTRAINT `donation_distributions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `donation_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incomes` ADD CONSTRAINT `incomes_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `income_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incomes` ADD CONSTRAINT `incomes_payer_id_fkey` FOREIGN KEY (`payer_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `expense_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_payee_id_fkey` FOREIGN KEY (`payee_id`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transactions` ADD CONSTRAINT `inventory_transactions_inventory_item_id_fkey` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transactions` ADD CONSTRAINT `inventory_transactions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_rentals` ADD CONSTRAINT `inventory_rentals_inventory_item_id_fkey` FOREIGN KEY (`inventory_item_id`) REFERENCES `inventory_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_rentals` ADD CONSTRAINT `inventory_rentals_rented_to_fkey` FOREIGN KEY (`rented_to`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `property_rentals` ADD CONSTRAINT `property_rentals_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rent_payments` ADD CONSTRAINT `rent_payments_property_rental_id_fkey` FOREIGN KEY (`property_rental_id`) REFERENCES `property_rentals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_board_term_id_fkey` FOREIGN KEY (`board_term_id`) REFERENCES `board_terms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_board_role_id_fkey` FOREIGN KEY (`board_role_id`) REFERENCES `board_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `board_members` ADD CONSTRAINT `board_members_mahalla_id_fkey` FOREIGN KEY (`mahalla_id`) REFERENCES `mahallas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mosque_role_assignments` ADD CONSTRAINT `mosque_role_assignments_mosque_id_fkey` FOREIGN KEY (`mosque_id`) REFERENCES `mosques`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mosque_role_assignments` ADD CONSTRAINT `mosque_role_assignments_mosque_role_id_fkey` FOREIGN KEY (`mosque_role_id`) REFERENCES `mosque_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mosque_role_assignments` ADD CONSTRAINT `mosque_role_assignments_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issues` ADD CONSTRAINT `issues_raised_by_fkey` FOREIGN KEY (`raised_by`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_decisions` ADD CONSTRAINT `meeting_decisions_meeting_id_fkey` FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meeting_decisions` ADD CONSTRAINT `meeting_decisions_related_issue_id_fkey` FOREIGN KEY (`related_issue_id`) REFERENCES `issues`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `user_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_requests` ADD CONSTRAINT `password_reset_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
