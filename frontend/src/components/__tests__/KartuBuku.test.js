// frontend/src/components/__tests__/KartuBuku.test.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import KartuBuku from '../buku/KartuBuku.vue'

// Stub komponen shadcn agar tidak perlu setup penuh
const stubs = {
  Card: { template: '<div class="card"><slot /></div>' },
  CardHeader: { template: '<div class="card-header"><slot /></div>' },
  CardContent: { template: '<div class="card-content"><slot /></div>' },
  CardFooter: { template: '<div class="card-footer"><slot /></div>' },
  CardTitle: { template: '<h3><slot /></h3>' },
  CardDescription: { template: '<p><slot /></p>' },
  Badge: { template: '<span class="badge"><slot /></span>' },
  Button: { template: '<button :disabled="$attrs.disabled"><slot /></button>', inheritAttrs: true },
  RouterLink: { template: '<a><slot /></a>' },
}

// Data buku untuk testing
const bukuMock = {
  id: 1,
  judul: 'Clean Code',
  penulis: 'Robert C. Martin',
  kategori: 'Teknologi',
  tahun: 2008,
  tersedia: true,
  penerbit: 'Prentice Hall',
}

describe('KartuBuku.vue', () => {
  it('menampilkan judul buku', () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Clean Code')
  })

  it('menampilkan nama penulis', () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Robert C. Martin')
  })

  it('menampilkan kategori buku', () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Teknologi')
  })

  it('menampilkan tahun buku', () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('2008')
  })

  it('emit event pinjam saat tombol Pinjam diklik', async () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    const buttons = wrapper.findAll('button')
    // Tombol Pinjam adalah button terakhir
    const tombolPinjam = buttons[buttons.length - 1]
    await tombolPinjam.trigger('click')
    expect(wrapper.emitted('pinjam')).toBeTruthy()
  })

  it('tombol Pinjam disabled jika buku tidak tersedia', () => {
    const bukuDipinjam = { ...bukuMock, tersedia: false }
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuDipinjam },
      global: { stubs },
    })
    const buttons = wrapper.findAll('button')
    const tombolPinjam = buttons[buttons.length - 1]
    expect(tombolPinjam.attributes('disabled')).toBeDefined()
  })

  it('menampilkan badge Tersedia jika buku tersedia', () => {
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuMock },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Tersedia')
  })

  it('menampilkan badge Dipinjam jika buku tidak tersedia', () => {
    const bukuDipinjam = { ...bukuMock, tersedia: false }
    const wrapper = mount(KartuBuku, {
      props: { buku: bukuDipinjam },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('Dipinjam')
  })
})
