-- Hapus semua user kecuali admin kitabifyid@gmail.com
-- Profiles dan data terkait akan ikut terhapus via ON DELETE CASCADE
DELETE FROM auth.users
WHERE email <> 'kitabifyid@gmail.com';
