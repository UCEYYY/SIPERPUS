-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2026 at 08:31 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `siperpus`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nim` varchar(20) DEFAULT NULL,
  `program_studi` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `tanggal_daftar` date NOT NULL DEFAULT curdate(),
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anggota`
--

INSERT INTO `anggota` (`id`, `user_id`, `nim`, `program_studi`, `alamat`, `no_hp`, `tanggal_daftar`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 2, '2021001', 'Teknik Informatika', NULL, '081234567890', '2026-05-19', 1, '2026-05-19 07:05:34', '2026-05-19 07:05:34');

-- --------------------------------------------------------

--
-- Table structure for table `buku`
--

CREATE TABLE `buku` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `penulis` varchar(255) NOT NULL,
  `penerbit` varchar(255) DEFAULT NULL,
  `tahun` smallint(6) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `sinopsis` text DEFAULT NULL,
  `stok` int(11) NOT NULL DEFAULT 1,
  `tersedia` int(11) NOT NULL DEFAULT 1,
  `cover_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku`
--

INSERT INTO `buku` (`id`, `judul`, `penulis`, `penerbit`, `tahun`, `isbn`, `kategori`, `sinopsis`, `stok`, `tersedia`, `cover_url`, `created_at`, `updated_at`) VALUES
(1, 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '9780132350884', 'Teknologi', NULL, 3, 3, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(2, 'Vue.js 3 for Beginners', 'Simone Cuomo', 'Packt', 2024, '9781803239859', 'Teknologi', NULL, 2, 1, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(3, 'Learning Vue', 'Maya Shavin', 'O\'Reilly', 2024, '9781492098843', 'Teknologi', NULL, 2, 2, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(4, 'Bumi', 'Tere Liye', 'Gramedia', 2014, '9786020316000', 'Fiksi', NULL, 4, 4, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(5, 'Atomic Habits', 'James Clear', 'Avery', 2018, '9780735211292', 'Bisnis', NULL, 3, 2, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(6, 'Sapiens', 'Yuval Noah Harari', 'Harper', 2011, '9780062316110', 'Sejarah', NULL, 2, 2, NULL, '2026-05-19 07:05:34', '2026-05-19 07:05:34'),
(7, 'The Pragmatic Programmer', 'David Thomas', 'inul daratista', 1999, '9780132350779', 'Teknologi', 'ayo goyang dumang', 2, 2, NULL, '2026-05-25 15:12:07', '2026-05-25 15:12:07'),
(8, 'Virus MBG', 'bUAHLIL', 'Hidup Jokowiii', 2013, '9786543223456', 'Pengembangan Diri', 'begitu intinya', 14, 14, NULL, '2026-06-05 08:41:11', '2026-06-05 08:41:11'),
(9, 'HAK KKU', 'bUKAN aku', 'Hidup Jokowiii', 2008, '9798543456543', 'Pengembangan Diri', NULL, 1, 1, NULL, '2026-07-12 11:56:15', '2026-07-12 11:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman`
--

CREATE TABLE `peminjaman` (
  `id` int(11) NOT NULL,
  `anggota_id` int(11) NOT NULL,
  `buku_id` int(11) NOT NULL,
  `tanggal_pinjam` date NOT NULL DEFAULT curdate(),
  `tanggal_kembali` date NOT NULL,
  `tanggal_dikembalikan` date DEFAULT NULL,
  `status` enum('aktif','selesai','terlambat') NOT NULL DEFAULT 'aktif',
  `denda` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('pustakawan','anggota') NOT NULL DEFAULT 'anggota',
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 'Ahmad Pustakawan', 'admin@siperpus.id', '$2b$10$wsU5G6lu7P8WqeWVMOYBPOQcJSue/ihwbq2GFbuG7ZMnEyK.28RRq', 'pustakawan', 1, '2026-05-19 07:05:34', '2026-05-24 10:41:28'),
(2, 'Siti Anggota', 'siti@gmail.com', '$2b$10$89PI3fF3CZEh5lVgLRRSuelXYO4jCCJnITbZpKMGFRMz69lA8B5.W', 'anggota', 1, '2026-05-19 07:05:34', '2026-05-24 10:41:28'),
(3, 'Admin', 'admin@siperpus.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '', 1, '2026-07-13 12:17:36', '2026-07-13 12:17:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `nim` (`nim`);

--
-- Indexes for table `buku`
--
ALTER TABLE `buku`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `idx_judul` (`judul`),
  ADD KEY `idx_penulis` (`penulis`),
  ADD KEY `idx_kategori` (`kategori`);

--
-- Indexes for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buku_id` (`buku_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_anggota` (`anggota_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggota`
--
ALTER TABLE `anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buku`
--
ALTER TABLE `buku`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `peminjaman`
--
ALTER TABLE `peminjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota`
--
ALTER TABLE `anggota`
  ADD CONSTRAINT `anggota_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD CONSTRAINT `peminjaman_ibfk_1` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`id`),
  ADD CONSTRAINT `peminjaman_ibfk_2` FOREIGN KEY (`buku_id`) REFERENCES `buku` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
