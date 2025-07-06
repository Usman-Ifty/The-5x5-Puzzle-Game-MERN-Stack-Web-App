#include<iostream>
#include<iomanip>
#include<conio.h>
#include<cstdlib>
#include<time.h> 
#include<fstream>
#include<string>
#include<cmath>
#include<Windows.h>
#include <chrono>
using namespace std;
const int ARROW_KEY_CHARACTER = 224;
const int ARROW_KEY_UP = 72;
const int ARROW_KEY_DOWN = 80;
const int ARROW_KEY_LEFT = 75;
const int ARROW_KEY_RIGHT = 77;
const int escape = 27;
bool is_solvable(int ar1[5][5], int ar2[5][5]);
void finale();
void init();
void initial_board();
void final_board();
void legal_moves(int array[5][5]);
void make_move();
bool is_goal();
void print_path();
void save(int array1[5][5], int array2[5][5]);
void load(int array1[5][5], int array2[5][5]);
int ar1[5][5], ar2[5][5];
int permanent1[5][5];
int permanent2[5][5];
char choice;
string path;
int move_count = 0;
std::chrono::time_point<std::chrono::steady_clock> start_time;

void setColor(int color) {
	HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	SetConsoleTextAttribute(hConsole, color);
}

void print_banner() {
	setColor(13);
	cout << "\n==============================\n";
	cout << "      The Puzzle Game C++     \n";
	cout << "==============================\n";
	setColor(7);
	cout << "\nBy: Muhammad Usman Awan\n";
	cout << "GitHub  : https://github.com/Usman-Ifty\n";
	cout << "LinkedIn: https://www.linkedin.com/in/usman-awan-a85877359/\n";
	cout << "Instagram: @ifty.reels\n\n";
}

int manhattan_distance() {
	int dist = 0;
	for (int i = 0; i < 5; i++) {
		for (int j = 0; j < 5; j++) {
			int val = permanent1[i][j];
			if (val == 0) continue;
			for (int x = 0; x < 5; x++) {
				for (int y = 0; y < 5; y++) {
					if (permanent2[x][y] == val) {
						dist += abs(i - x) + abs(j - y);
					}
				}
			}
		}
	}
	return dist;
}

void print_status() {
	setColor(11);
	cout << "Moves: " << move_count << "  |  ";
	auto now = std::chrono::steady_clock::now();
	int seconds = std::chrono::duration_cast<std::chrono::seconds>(now - start_time).count();
	cout << "Time: " << seconds << "s" << endl;
	setColor(7);
	cout << "Manhattan distance to goal: " << manhattan_distance() << endl;
}

void easy_board() {
	// Fill permanent1 and permanent2 with a board that is 1 move away from solved
	int val = 1;
	for (int i = 0; i < 5; i++) {
		for (int j = 0; j < 5; j++) {
			permanent2[i][j] = val % 25;
			val++;
		}
	}
	// Copy goal to current, then swap last two tiles to make it 1 move away
	for (int i = 0; i < 5; i++)
		for (int j = 0; j < 5; j++)
			permanent1[i][j] = permanent2[i][j];
	// Swap last two tiles (bottom right and left)
	std::swap(permanent1[4][3], permanent1[4][4]);
}

void print_hint() {
	// Suggest a move: find a tile not in place and suggest moving it
	for (int i = 0; i < 5; i++) {
		for (int j = 0; j < 5; j++) {
			if (permanent1[i][j] != 0 && permanent1[i][j] != permanent2[i][j]) {
				cout << "Hint: Try moving tile " << permanent1[i][j] << endl;
				return;
			}
		}
	}
	cout << "You're almost there!" << endl;
}

int main()
{
	int menu_choice = 0;
	print_banner();
	cout << "1. Easy Board (winnable in 1 move)\n2. Random Board\nChoose option: ";
	cin >> menu_choice;
	if (menu_choice == 1) {
		easy_board();
	}
	else {
		srand(time(0));
		while (true)
		{
			initial_board();
			final_board();
			for (int i = 0; i < 5; i++)
			{
				for (int j = 0; j < 5; j++)
				{
					permanent1[i][j] = ar1[i][j];
				}
			}
			for (int i = 0; i < 5; i++)
			{
				for (int j = 0; j < 5; j++)
				{
					permanent2[i][j] = ar2[i][j];
				}
			}
			if (is_solvable(permanent1, permanent2))
				break;
		}
	}
	move_count = 0;
	start_time = std::chrono::steady_clock::now();
	cout << "THE GOAL IS REACHABLE\n";

	while (1)
	{
		system("cls");
		print_banner();
		print_status();
		init();
		cout << endl;
		finale();
		cout << endl;
		legal_moves(permanent1);
		cout << endl;
		setColor(14);
		cout << "Use ARROW KEYS to move the empty tile (gray)." << endl;
		setColor(12);
		cout << "Press ESC to save game." << endl;
		setColor(7);
		print_hint();
		make_move();

		if (is_goal())
		{
			setColor(10);
			cout << "\n\tYou won the game, congrats!\n";
			cout << "\t\tYou did the following moves:\n";
			print_path();
			setColor(7);
			break;
		}
	}
}

void initial_board()
{

	int temp;
	int ar[25];
	bool flag;
	for (int i = 0; i < 25; i++)
	{
		do
		{

			temp = rand() % 25;
			flag = true;
			for (int j = 0; j < i; j++)
			{
				if (ar[j] == temp)
				{
					flag = false;
				}
			}
		} while (!flag);
		ar[i] = temp;

	}
	int p = 0;
	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{

			ar1[i][j] = ar[p];
			p++;
		}

	}


}
//final
void final_board()
{

	int temp;
	int ar[25];
	bool flag;
	for (int i = 0; i < 25; i++)
	{
		do
		{

			temp = rand() % 25;
			flag = true;
			for (int j = 0; j < i; j++)
			{
				if (ar[j] == temp)
				{
					flag = false;
				}
			}
		} while (!flag);
		ar[i] = temp;

	}
	int p = 0;
	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{

			ar2[i][j] = ar[p];
			p++;
		}

	}




}
//solvable
bool is_solvable(int ar1[5][5], int ar2[5][5])
{
	int temp_1[25], temp_2[25];
	int  k = 0, p = 0, count1 = 0, count2 = 0, sum1 = 0, sum2 = 0;
	bool res = false;
	//first bogus array 
	for (int i = 0; i < 5; i++)
	{

		for (int j = 0; j < 5; j++)
		{

			temp_1[k] = ar1[i][j];
			k++;
		}

	}
	// second bogus array
	for (int i = 0; i < 5; i++)
	{

		for (int j = 0; j < 5; j++)
		{

			temp_2[p] = ar2[i][j];
			p++;
		}

	}
	//inversions of first bogus array
	for (int i = 0; i < 25; i++)
	{
		count1 = 0;
		for (int j = 0; j < 25; j++)
		{
			if (temp_1[i] > temp_1[j])
			{
				count1++;

			}

		}
		sum1 += count1;
	}
	//inversions of second bogus array
	for (int i = 0; i < 25; i++)
	{
		count2 = 0;
		for (int j = 0; j < 25; j++)
		{
			if (temp_2[i] > temp_2[j])
			{
				count2++;

			}

		}
		sum2 += count2;
	}
	// solvable or not
	if ((sum1 % 2 == 0 && sum2 % 2 == 0) || (sum1 % 2 != 0 && sum2 % 2 != 0))
	{

		res = true;
		return res;
	}
	else
		return res;
}
void init()
{
	cout << "\n    ";
	setColor(11); // Cyan border
	cout << "+------+------+------+------+------+" << endl;
	for (int i = 0; i < 5; i++)
	{
		cout << "    ";
		for (int j = 0; j < 5; j++)
		{
			setColor(11); // Cyan border
			cout << "|";
			if (permanent1[i][j] == 0) {
				setColor(8); // Gray for empty
				cout << "    ";
			} else {
				setColor(14); // Yellow for numbers
				cout << setw(4) << permanent1[i][j] << " ";
			}
		}
		setColor(11);
		cout << "|" << endl;
		cout << "    +------+------+------+------+------+" << endl;
	}
	setColor(7); // Reset
}
void finale()
{
	cout << endl;
	cout << "FINAL BOARD IS :\n";
	cout << "    ";
	setColor(13); // Magenta border
	cout << "+------+------+------+------+------+" << endl;
	for (int i = 0; i < 5; i++)
	{
		cout << "    ";
		for (int j = 0; j < 5; j++)
		{
			setColor(13); // Magenta border
			cout << "|";
			if (permanent2[i][j] == 0) {
				setColor(8); // Gray for empty
				cout << "    ";
			} else {
				setColor(10); // Green for numbers
				cout << setw(4) << permanent2[i][j] << " ";
			}
		}
		setColor(13);
		cout << "|" << endl;
		cout << "    +------+------+------+------+------+" << endl;
	}
	setColor(7); // Reset
}
void legal_moves(int array[5][5])
{
	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
			if (array[i][j] == 0)
			{
				if (i == 0 && j == 0)
				{
					cout << "Legal Moves at this position are:\n" << "LEFT\n" << "UP\n";
				}
				else if ((i == 0 && j == 1) || (i == 0 && j == 2) || (i == 0 && j == 3))
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "LEFT\n" << "UP\n";
				else if ((i == 0 && j == 4))
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "UP\n";
				else if ((i == 1 && j == 0) || (i == 2 && j == 0) || (i == 3 && j == 0))
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "UP\n" << "DOWN\n";
				else if ((i == 1 && j == 4) || (i == 2 && j == 4) || (i == 3 && j == 4))
					cout << "Legal Moves at this position are:\n" << "LEFT\n" << "UP\n" << "DOWN\n";
				else if ((i == 4 && j == 0))
					cout << "Legal Moves at this position are:\n" << "LEFT\n" << "DOWN\n";
				else if ((i == 4 && j == 1) || (i == 4 && j == 2) || (i == 4 && j == 3))
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "LEFT\n" << "DOWN\n";
				else if (i == 4 && j == 4)
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "DOWN\n";
				else
					cout << "Legal Moves at this position are:\n" << "RIGHT\n" << "LEFT\n" << "UP\n" << "DOWN\n";
			}

		}

	}
}

void make_move()
{
	int r = 0, c = 0;
	bool moved = false;
	while (!moved) {
		for (int i = 0; i < 5; i++)
		{
			for (int j = 0; j < 5; j++)
			{
				if (permanent1[i][j] == 0)
				{
					r = i;
					c = j;
				}
			}
		}
		char decision;
		unsigned char char_read = _getch();
		if (char_read == ARROW_KEY_CHARACTER || char_read == 0)
		{
			unsigned char arrow_read = _getch();
			switch (arrow_read)
			{
			case ARROW_KEY_UP:
				if (r == 0)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r - 1][c]);
					path += "U, ";
					move_count++;
					init();
					cout << "Moved UP. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_DOWN:
				if (r == 4)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r + 1][c]);
					path += "D, ";
					move_count++;
					init();
					cout << "Moved DOWN. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_LEFT:
				if (c == 0)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r][c - 1]);
					path += "L, ";
					move_count++;
					init();
					cout << "Moved LEFT. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_RIGHT:
				if (c == 4)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r][c + 1]);
					path += "R, ";
					move_count++;
					init();
					cout << "Moved RIGHT. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			}
		}
		else if (char_read == ARROW_KEY_UP || char_read == ARROW_KEY_DOWN || char_read == ARROW_KEY_LEFT || char_read == ARROW_KEY_RIGHT)
		{
			unsigned char arrow_read = char_read;
			switch (arrow_read)
			{
			case ARROW_KEY_UP:
				if (r == 0)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r - 1][c]);
					path += "U, ";
					move_count++;
					init();
					cout << "Moved UP. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_DOWN:
				if (r == 4)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r + 1][c]);
					path += "D, ";
					move_count++;
					init();
					cout << "Moved DOWN. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_LEFT:
				if (c == 0)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r][c - 1]);
					path += "L, ";
					move_count++;
					init();
					cout << "Moved LEFT. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			case ARROW_KEY_RIGHT:
				if (c == 4)
				{
					cout << "Error Illegal move\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
				else
				{
					swap(permanent1[r][c], permanent1[r][c + 1]);
					path += "R, ";
					move_count++;
					init();
					cout << "Moved RIGHT. Press any key to continue..."; _getch();
					moved = true;
				}
				break;
			}
		}
		else
		{
			if (char_read == escape)
			{
				save(permanent1, permanent2);
				cout << endl;
				cout << "Your game has been saved\n";
				cout << "Do you want to continue? Y or N?\n";
				decision = _getch();
				if (decision == 'Y' || decision == 'y')
				{
					load(permanent1, permanent2);
					init();
					cout << "Game loaded. Press any key to continue..."; _getch();
					moved = true;
				}
				else if (decision == 'N' || decision == 'n')
				{
					exit(0);
				}
				else {
					cout << "Invalid input. Continuing...\n";
					init();
					cout << "Press any key to continue..."; _getch();
				}
			}
			else {
				cout << "Invalid key. Use arrow keys or ESC.\n";
				init();
				cout << "Press any key to continue..."; _getch();
			}
		}
	}
}
bool is_goal()
{
	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
			if (permanent1[i][j] != permanent2[i][j])
				return false;
		}
	}
	return true;
}
void print_path()
{
	for (int i = 0; path[i] != '\0'; i++)
		cout << path[i];
}
void save(int array1[5][5], int array2[5][5])
{
	//initial array saver
	ofstream saver1;

	saver1.open("saveini.txt", ios_base::out);
	if (!saver1)
	{
		cout << "Error";
	}
	else
	{
		for (int i = 0; i < 5; i++)
		{
			for (int j = 0; j < 5; j++)
			{
				saver1 << permanent1[i][j] << " ";
			}
		}
		saver1.close();
	}

	//final array saver
	ofstream saver2;

	saver2.open("savefinal.txt", ios_base::out);
	if (!saver2)
	{
		cout << "Error";
	}
	else
	{
		for (int i = 0; i < 5; i++)
		{
			for (int j = 0; j < 5; j++)
			{
				saver2 << permanent2[i][j] << " ";
			}
		}
		saver2.close();
	}
}
void load(int array1[5][5], int array2[5][5])
{
	//initial array loader
	string _char1;
	ifstream loader1;
	loader1.open("saveini.txt", ios::in);
	if (!loader1)
	{
		cout << "Error";
	}
	else
	{
		for (int i = 0; i < 5; i++)
		{
			for (int j = 0; j < 5; j++)
			{
				loader1 >> _char1;
				if (_char1 != " ")
				{

					permanent1[i][j] = atoi(_char1.c_str());
				}
			}
		}


	}
	//final array loader
	string _char2;
	ifstream loader2;
	loader2.open("savefinal.txt", ios::in);
	if (!loader2)
	{
		cout << "Error";
	}
	else
	{
		for (int i = 0; i < 5; i++)
		{
			for (int j = 0; j < 5; j++)
			{
				loader2 >> _char2;
				if (_char2 != " ")
				{

					permanent2[i][j] = atoi(_char2.c_str());
				}
			}
		}

	}

}