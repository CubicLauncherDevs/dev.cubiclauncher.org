{
  description = "CubicLauncher Docs - sitio SvelteKit (entorno de desarrollo)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            nodejs_22
            git
          ];

          shellHook = ''
            echo "CubicLauncher Docs — entorno de desarrollo (bun $(bun --version))"
            echo "  bun install    # instalar dependencias"
            echo "  bun run dev    # servidor de desarrollo"
            echo "  bun run build  # build de producción"
            echo "  bun run check  # verificar tipos"
          '';
        };
      });

      formatter = forAllSystems (pkgs: pkgs.nixpkgs-fmt);
    };
}
