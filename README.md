# Script for Binance Price Alerts

------------------------

* ssh your_username@your_server_ip

### install python
* `sudo apt update`
* `sudo apt install python3 python3-venv python3-pip -y`

### install tmux 
* `sudo apt update`
* `sudo apt install tmux`  # For Debian-based systems
* `sudo yum install tmux`  # For Red Hat-based systems

### setup environment 
* `python3 -m venv myenv`
* `source myenv/bin/activate`
* `pip install requests`
* `pip install flask`
* `pip install apscheduler`


### create session
* `tmux new -s my_session`

* `cd /opt/jenkins/bi/`
* `source myenv/bin/activate`
* `python binance.py`

Detach from the tmux session:
Press Ctrl-b followed by d.

* `tmux ls`

Reattach to the tmux session:
* `tmux attach-session -t my_session`

* `tmux kill-session -t my_session`


