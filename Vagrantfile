$vm_memory = 512

Vagrant.configure(2) do |config|
  config.vm.synced_folder '.', '/vagrant', disabled: true

  config.vm.provision :shell, path: 'deploy/bootstrap.sh'

  config.vm.provision :file, source: '~/.secrets/projects/fics/fics.bughou.se.crt', destination: '/etc/ssl/certs/fics.bughou.se.crt'
  config.vm.provision :file, source: '~/.secrets/projects/fics/intermediate.crt', destination: '/etc/ssl/certs/intermediate.crt'
  config.vm.provision :file, source: '~/.secrets/projects/fics/fics.bughou.se.key', destination: '/etc/ssl/private/fics.bughou.se.key'

  config.vm.define 'testing', primary: true do |test|
    test.vm.box = 'hansode/fedora-21-server-x86_64'
    test.vm.network :forwarded_port, host: 4567, guest: 80

    test.vm.provider :virtualbox do |vb|
      vb.memory = $vm_memory
    end
  end

  config.vm.define 'production' do |production|
    production.vm.hostname = 'fics.bughou.se'

    production.ssh.private_key_path = '~/.ssh/id_rsa'
    production.ssh.username = 'sonny'
    production.ssh.pty = true

    production.vm.box = 'digital_ocean'
    production.vm.box_url = 'https://github.com/smdahlen/vagrant-digitalocean/raw/master/box/digital_ocean.box'

    production.vm.provider :digital_ocean do |provider, _|
      provider.token = File.read(File.expand_path('~/.digitalocean_token'))

      provider.image = 'fedora-21-x64'
      provider.region = 'nyc3'
      provider.size = "#{$vm_memory}mb"

      provider.backups_enabled = false
    end
  end
end
