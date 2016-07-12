module Assets
  class HypeDigestManifest

    def self.get(name)
      assets[name]
    end

    def self.set(name, digest)
      assets[name] = digest
    end

    def self.assets
      @@assets ||= {}
    end
  end
end
