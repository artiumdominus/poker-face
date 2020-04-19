# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :poker_face,
  ecto_repos: [PokerFace.Repo]

# Configures the endpoint
config :poker_face, PokerFace.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "cPyO/nnE4MY/4HTAGpRRHpMVdD5O/Xn/b5Mly8tO8fyHPc463vMXOPoC/biC5XEp",
  render_errors: [view: PokerFace.ErrorView, accepts: ~w(html json)],
  pubsub: [name: PokerFace.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
