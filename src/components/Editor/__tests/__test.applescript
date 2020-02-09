# https://eastmanreference.com/complete-list-of-applescript-key-codes

# Opens an app e.g. "Google Chrome", "Firefox", "Safari".
on openApp(appName)
	activate application appName
end openApp

# Opens a new tab e.g. command-t.
on openNewTab()
	set keyCodeT to 17
	tell application "System Events"
		key code keyCodeT using command down # t
	end tell
end openNewTab

# Types character data.
on type(cdata)
	tell application "System Events"
		keystroke cdata
	end tell
end type

# Presses the enter key.
#
# FIXME: Enter?
on enter()
	set keyCodeEnter to 36
	tell application "System Events"
		key code keyCodeEnter
	end tell
end enter

# Sleeps for x milliseconds.
on sleep(ms)
	delay ms / 1000
end sleep

# Focuses the editor (uses tab once).
on focus()
	set keyCodeTab to 48
	tell application "System Events"
		key code keyCodeTab
	end tell
end focus

# Clears character data.
on clear()
	set keyCodeA to 0
	set keyCodeDelete to 51 # Backspace
	tell application "System Events"
		key code keyCodeA using command down
		key code keyCodeDelete
	end tell
end clear

openApp("Firefox")
openNewTab()
type("http://localhost:3000")
enter()
sleep(1000)
focus()
clear()
type("Hello, world! :smile:\n\nHello, world! :smile:\n\nHello, world! :smile:")
# enter()
return "Hello, world! :smile:"
