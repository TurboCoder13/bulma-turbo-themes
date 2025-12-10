from turbo_themes import THEMES


def test_themes_present():
    assert THEMES, "Themes registry should not be empty"
