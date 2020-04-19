defmodule PokerFace.PageController do
  use PokerFace.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
